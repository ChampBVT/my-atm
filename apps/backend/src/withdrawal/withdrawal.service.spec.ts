import { Test } from '@nestjs/testing';
import { WithdrawalService } from 'src/withdrawal/withdrawal.service';
import { mocker } from 'src/common/test/mocker';
import { Account } from 'src/account/model/account.model';
import { WithdrawSuccess } from 'src/withdrawal/model/withdraw-success.model';
import { AccountService } from 'src/account/account.service';
import { StorageService } from 'src/storage/storage.service';
import { StorageEntity } from 'src/storage/storage.entity';
import { InvalidPinError } from 'src/common/error/invalid-pin-error.model';
import { OverdrawnError } from 'src/withdrawal/model/overdrawn-user-error.model';
import { InvalidWithdrawAmountError } from 'src/withdrawal/model/invalid-withdraw-amount-user-error.model';
import { InsufficientNoteError } from 'src/withdrawal/model/insufficient-note-user-error.model';
import { InternalServerErrorException } from '@nestjs/common';

describe(WithdrawalService.name, () => {
  let withdrawalService: WithdrawalService;
  let accountService: AccountService;
  let storageService: StorageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [WithdrawalService],
    })
      .useMocker(mocker)
      .compile();

    withdrawalService = moduleRef.get<WithdrawalService>(WithdrawalService);
    accountService = moduleRef.get<AccountService>(AccountService);
    storageService = moduleRef.get<StorageService>(StorageService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe(WithdrawalService.prototype.getAvailableNoteValues.name, () => {
    it('Return tenNotes, twentyNotes, given fiveNotes is empty', async () => {
      const result = withdrawalService.getAvailableNoteValues({
        id: 1,
        fiveNotes: 0,
        tenNotes: 1,
        twentyNotes: 2,
        totalValue: 0,
      });

      expect(result).toEqual([
        ['twentyNotes', 20],
        ['tenNotes', 10],
      ]);
    });

    it('Return tenNotes, given fiveNotes and twentyNotes is empty', async () => {
      const result = withdrawalService.getAvailableNoteValues({
        id: 1,
        fiveNotes: 0,
        tenNotes: 999,
        twentyNotes: 0,
        totalValue: 0,
      });

      expect(result).toEqual([['tenNotes', 10]]);
    });

    it('Return all notes, given the machine has every notes', async () => {
      const result = withdrawalService.getAvailableNoteValues({
        id: 1,
        fiveNotes: 10,
        tenNotes: 99,
        twentyNotes: 4,
        totalValue: 0,
      });

      expect(result).toEqual([
        ['twentyNotes', 20],
        ['tenNotes', 10],
        ['fiveNotes', 5],
      ]);
    });

    it('Return empty array, given the machine no notes', async () => {
      const result = withdrawalService.getAvailableNoteValues({
        id: 1,
        fiveNotes: 0,
        tenNotes: 0,
        twentyNotes: 0,
        totalValue: 0,
      });

      expect(result).toEqual([]);
    });
  });

  describe(WithdrawalService.prototype.withdraw.name, () => {
    it('Return WithdrawSuccess, given successful withdrawal', async () => {
      const pin = '1234';
      const amountToWithdraw = 35;

      const mockAccount = new Account({ id: 1, balance: 200 });

      const mockStorage: StorageEntity = {
        id: 1,
        fiveNotes: 10,
        tenNotes: 10,
        twentyNotes: 10,
        totalValue: 500,
      };

      jest
        .spyOn(accountService, 'getCurrentAccount')
        .mockResolvedValue(mockAccount);
      jest
        .spyOn(storageService, 'getCurrentStorage')
        .mockResolvedValue(mockStorage);
      jest.spyOn(withdrawalService, 'getAvailableNoteValues').mockReturnValue([
        ['twentyNotes', 20],
        ['tenNotes', 10],
        ['fiveNotes', 5],
      ]);
      jest.spyOn(withdrawalService, 'calculateWithdrawal').mockReturnValue({
        withdrawNotes: {
          fiveNotes: 1,
          tenNotes: 1,
          twentyNotes: 1,
        },
        updatedStorage: {
          fiveNotes: 9,
          tenNotes: 9,
          twentyNotes: 9,
        },
      });
      jest.spyOn(storageService, 'updateCurrentStorageById');
      jest.spyOn(accountService, 'updateCurrentBalanceById');

      const result = await withdrawalService.withdraw(pin, amountToWithdraw);

      expect(result).toBeInstanceOf(WithdrawSuccess);
      expect(result).toEqual({ fiveNotes: 1, tenNotes: 1, twentyNotes: 1 });
      expect(storageService.updateCurrentStorageById).toBeCalledTimes(1);
      expect(storageService.updateCurrentStorageById).toHaveBeenCalledWith(1, {
        fiveNotes: 9,
        tenNotes: 9,
        twentyNotes: 9,
      });
      expect(accountService.updateCurrentBalanceById).toBeCalledTimes(1);
      expect(accountService.updateCurrentBalanceById).toHaveBeenCalledWith(
        1,
        mockAccount.balance - amountToWithdraw,
      );
    });

    it('Return InvalidPinError, given pin is invalid', async () => {
      const pin = '1234';
      const amountToWithdraw = 35;

      jest
        .spyOn(accountService, 'getCurrentAccount')
        .mockResolvedValue(new InvalidPinError(''));
      jest.spyOn(storageService, 'updateCurrentStorageById');
      jest.spyOn(accountService, 'updateCurrentBalanceById');

      const result = await withdrawalService.withdraw(pin, amountToWithdraw);

      expect(result).toBeInstanceOf(InvalidPinError);
      expect(storageService.updateCurrentStorageById).toBeCalledTimes(0);
      expect(accountService.updateCurrentBalanceById).toBeCalledTimes(0);
    });

    it('Return OverdrawnError, given amountToWithdraw is more than allowed overdrawn', async () => {
      const pin = '1234';
      const amountToWithdraw = 301;
      const mockAccount = new Account({ id: 1, balance: 200 });

      jest
        .spyOn(accountService, 'getCurrentAccount')
        .mockResolvedValue(mockAccount);
      jest.spyOn(storageService, 'updateCurrentStorageById');
      jest.spyOn(accountService, 'updateCurrentBalanceById');

      const result = await withdrawalService.withdraw(pin, amountToWithdraw);

      expect(result).toBeInstanceOf(OverdrawnError);
      expect(storageService.updateCurrentStorageById).toBeCalledTimes(0);
      expect(accountService.updateCurrentBalanceById).toBeCalledTimes(0);
    });

    it('Return InsufficientNoteError, given the machine has no notes', async () => {
      const pin = '1234';
      const amountToWithdraw = 100;

      const mockAccount = new Account({ id: 1, balance: 200 });

      jest
        .spyOn(accountService, 'getCurrentAccount')
        .mockResolvedValue(mockAccount);
      jest
        .spyOn(withdrawalService, 'getAvailableNoteValues')
        .mockReturnValue([]);
      jest.spyOn(storageService, 'updateCurrentStorageById');
      jest.spyOn(accountService, 'updateCurrentBalanceById');

      const result = await withdrawalService.withdraw(pin, amountToWithdraw);

      expect(result).toBeInstanceOf(InsufficientNoteError);
      expect(storageService.updateCurrentStorageById).toBeCalledTimes(0);
      expect(accountService.updateCurrentBalanceById).toBeCalledTimes(0);
    });

    it('Return InvalidWithdrawAmountError, given the amountToWithdraw is cannot be fulfilled', async () => {
      const pin = '1234';
      const amountToWithdraw = 101;

      const mockAccount = new Account({ id: 1, balance: 200 });

      jest
        .spyOn(accountService, 'getCurrentAccount')
        .mockResolvedValue(mockAccount);
      jest
        .spyOn(withdrawalService, 'getAvailableNoteValues')
        .mockReturnValue([['tenNotes', 10]]);
      jest.spyOn(storageService, 'updateCurrentStorageById');
      jest.spyOn(accountService, 'updateCurrentBalanceById');

      const result = await withdrawalService.withdraw(pin, amountToWithdraw);

      expect(result).toBeInstanceOf(InvalidWithdrawAmountError);
      expect(storageService.updateCurrentStorageById).toBeCalledTimes(0);
      expect(accountService.updateCurrentBalanceById).toBeCalledTimes(0);
    });

    it('Return InsufficientNoteError, given the amountToWithdraw is more than the amount the machine has', async () => {
      const pin = '1234';
      const amountToWithdraw = 600;

      const mockAccount = new Account({ id: 1, balance: 1000 });
      const mockStorage: StorageEntity = {
        id: 1,
        fiveNotes: 2,
        tenNotes: 9,
        twentyNotes: 20,
        totalValue: 500,
      };

      jest
        .spyOn(accountService, 'getCurrentAccount')
        .mockResolvedValue(mockAccount);
      jest
        .spyOn(storageService, 'getCurrentStorage')
        .mockResolvedValue(mockStorage);
      jest.spyOn(storageService, 'updateCurrentStorageById');
      jest.spyOn(accountService, 'updateCurrentBalanceById');

      const result = await withdrawalService.withdraw(pin, amountToWithdraw);

      expect(result).toBeInstanceOf(InsufficientNoteError);
      expect(storageService.updateCurrentStorageById).toBeCalledTimes(0);
      expect(accountService.updateCurrentBalanceById).toBeCalledTimes(0);
    });

    it('Return UserError, given the calculateWithdrawal thrown UserError', async () => {
      const pin = '1234';
      const amountToWithdraw = 100;

      const mockAccount = new Account({ id: 1, balance: 1000 });
      const mockStorage: StorageEntity = {
        id: 1,
        fiveNotes: 2,
        tenNotes: 9,
        twentyNotes: 20,
        totalValue: 500,
      };

      jest
        .spyOn(accountService, 'getCurrentAccount')
        .mockResolvedValue(mockAccount);
      jest
        .spyOn(storageService, 'getCurrentStorage')
        .mockResolvedValue(mockStorage);
      jest.spyOn(storageService, 'updateCurrentStorageById');
      jest.spyOn(accountService, 'updateCurrentBalanceById');
      jest
        .spyOn(withdrawalService, 'calculateWithdrawal')
        .mockImplementation(() => {
          throw new InsufficientNoteError('Error');
        });

      const result = await withdrawalService.withdraw(pin, amountToWithdraw);

      expect(result).toBeInstanceOf(InsufficientNoteError);
      expect(storageService.updateCurrentStorageById).toBeCalledTimes(0);
      expect(accountService.updateCurrentBalanceById).toBeCalledTimes(0);
    });

    it('Throw InternalServerErrorException, given non UserError occurred', async () => {
      const pin = '1234';
      const amountToWithdraw = 100;

      const mockAccount = new Account({ id: 1, balance: 1000 });
      const mockStorage: StorageEntity = {
        id: 1,
        fiveNotes: 2,
        tenNotes: 9,
        twentyNotes: 20,
        totalValue: 500,
      };

      jest
        .spyOn(accountService, 'getCurrentAccount')
        .mockResolvedValue(mockAccount);
      jest
        .spyOn(storageService, 'getCurrentStorage')
        .mockResolvedValue(mockStorage);
      jest
        .spyOn(storageService, 'updateCurrentStorageById')
        .mockRejectedValue(null);
      jest.spyOn(accountService, 'updateCurrentBalanceById');

      await expect(
        withdrawalService.withdraw(pin, amountToWithdraw),
      ).rejects.toThrow(InternalServerErrorException);

      expect(storageService.updateCurrentStorageById).toBeCalledTimes(1);
      expect(accountService.updateCurrentBalanceById).toBeCalledTimes(0);
    });
  });

  describe(WithdrawalService.prototype.calculateWithdrawal.name, () => {
    const testCases: {
      id: number;
      availableNoteValues: [string, number][];
      storage: Pick<StorageEntity, 'fiveNotes' | 'tenNotes' | 'twentyNotes'>;
      amountToWithdraw: number;
      withdrawNotes: Pick<
        StorageEntity,
        'fiveNotes' | 'tenNotes' | 'twentyNotes'
      >;
      updatedStorage: Pick<
        StorageEntity,
        'fiveNotes' | 'tenNotes' | 'twentyNotes'
      >;
    }[] = [
      {
        id: 1,
        availableNoteValues: [
          ['twentyNotes', 20],
          ['tenNotes', 10],
          ['fiveNotes', 5],
        ],
        storage: {
          fiveNotes: 10,
          tenNotes: 10,
          twentyNotes: 20,
        },
        amountToWithdraw: 100,
        withdrawNotes: { fiveNotes: 2, tenNotes: 3, twentyNotes: 3 },
        updatedStorage: { fiveNotes: 8, tenNotes: 7, twentyNotes: 17 },
      },
      {
        id: 2,
        availableNoteValues: [
          ['twentyNotes', 20],
          ['tenNotes', 10],
          ['fiveNotes', 5],
        ],
        storage: {
          fiveNotes: 5,
          tenNotes: 3,
          twentyNotes: 8,
        },
        amountToWithdraw: 120,
        withdrawNotes: { fiveNotes: 2, tenNotes: 3, twentyNotes: 4 },
        updatedStorage: { fiveNotes: 3, tenNotes: 0, twentyNotes: 4 },
      },
      {
        id: 3,
        availableNoteValues: [
          ['twentyNotes', 20],
          ['tenNotes', 10],
          ['fiveNotes', 5],
        ],
        storage: {
          fiveNotes: 1,
          tenNotes: 3,
          twentyNotes: 10,
        },
        amountToWithdraw: 100,
        withdrawNotes: { fiveNotes: 0, tenNotes: 2, twentyNotes: 4 },
        updatedStorage: { fiveNotes: 1, tenNotes: 1, twentyNotes: 6 },
      },
      {
        id: 4,
        availableNoteValues: [
          ['twentyNotes', 20],
          ['tenNotes', 10],
          ['fiveNotes', 5],
        ],
        storage: {
          fiveNotes: 2,
          tenNotes: 3,
          twentyNotes: 20,
        },
        amountToWithdraw: 105,
        withdrawNotes: { fiveNotes: 1, tenNotes: 2, twentyNotes: 4 },
        updatedStorage: { fiveNotes: 1, tenNotes: 1, twentyNotes: 16 },
      },
      {
        id: 5,
        availableNoteValues: [
          ['twentyNotes', 20],
          ['fiveNotes', 5],
        ],
        storage: {
          fiveNotes: 1,
          tenNotes: 0,
          twentyNotes: 20,
        },
        amountToWithdraw: 100,
        withdrawNotes: { fiveNotes: 0, tenNotes: 0, twentyNotes: 5 },
        updatedStorage: { fiveNotes: 1, tenNotes: 0, twentyNotes: 15 },
      },
      {
        id: 6,
        availableNoteValues: [['fiveNotes', 5]],
        storage: {
          fiveNotes: 5,
          tenNotes: 0,
          twentyNotes: 0,
        },
        amountToWithdraw: 20,
        withdrawNotes: { fiveNotes: 4, tenNotes: 0, twentyNotes: 0 },
        updatedStorage: { fiveNotes: 1, tenNotes: 0, twentyNotes: 0 },
      },
      {
        id: 7,
        availableNoteValues: [
          ['tenNotes', 10],
          ['fiveNotes', 5],
        ],
        storage: {
          fiveNotes: 5,
          tenNotes: 5,
          twentyNotes: 0,
        },
        amountToWithdraw: 20,
        withdrawNotes: { fiveNotes: 2, tenNotes: 1, twentyNotes: 0 },
        updatedStorage: { fiveNotes: 3, tenNotes: 4, twentyNotes: 0 },
      },
      {
        id: 8,
        availableNoteValues: [
          ['twentyNotes', 20],
          ['tenNotes', 10],
          ['fiveNotes', 5],
        ],
        storage: {
          fiveNotes: 1,
          tenNotes: 1,
          twentyNotes: 5,
        },
        amountToWithdraw: 20,
        withdrawNotes: { fiveNotes: 0, tenNotes: 0, twentyNotes: 1 },
        updatedStorage: { fiveNotes: 1, tenNotes: 1, twentyNotes: 4 },
      },
      {
        id: 9,
        availableNoteValues: [
          ['twentyNotes', 20],
          ['tenNotes', 10],
          ['fiveNotes', 5],
        ],
        storage: {
          fiveNotes: 2,
          tenNotes: 3,
          twentyNotes: 5,
        },
        amountToWithdraw: 70,
        withdrawNotes: { fiveNotes: 2, tenNotes: 2, twentyNotes: 2 },
        updatedStorage: { fiveNotes: 0, tenNotes: 1, twentyNotes: 3 },
      },
      {
        id: 10,
        availableNoteValues: [
          ['twentyNotes', 20],
          ['tenNotes', 10],
          ['fiveNotes', 5],
        ],
        storage: {
          fiveNotes: 20,
          tenNotes: 30,
          twentyNotes: 50,
        },
        amountToWithdraw: 1350,
        withdrawNotes: { fiveNotes: 20, tenNotes: 25, twentyNotes: 50 },
        updatedStorage: { fiveNotes: 0, tenNotes: 5, twentyNotes: 0 },
      },
    ];

    it.each(testCases)(
      'Withdrawal ($id)',
      ({
        availableNoteValues,
        storage,
        amountToWithdraw,
        withdrawNotes,
        updatedStorage,
      }) => {
        const result = withdrawalService.calculateWithdrawal({
          availableNoteValues,
          amountToWithdraw,
          storage,
        });

        expect(result.withdrawNotes).toEqual(withdrawNotes);
        expect(result.updatedStorage).toEqual(updatedStorage);
      },
    );
  });
});
