import { InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AccountEntity } from 'src/account/account.entity';
import { AccountRepository } from 'src/account/account.repository';
import { AccountService } from 'src/account/account.service';
import { Account } from 'src/account/model/account.model';
import { InvalidPinError } from 'src/common/error/invalid-pin-error.model';
import { ScreenCloudService } from 'src/common/external/screencloud/screencloud.service';
import { mocker } from 'src/common/test/mocker';

describe(AccountService.name, () => {
  let accountService: AccountService;
  let accountRepository: AccountRepository;
  let screenCloudService: ScreenCloudService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AccountService],
    })
      .useMocker(mocker)
      .compile();

    accountService = moduleRef.get<AccountService>(AccountService);
    screenCloudService = moduleRef.get<ScreenCloudService>(ScreenCloudService);
    accountRepository = moduleRef.get<AccountRepository>(AccountRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe(AccountService.prototype.getCurrentAccount.name, () => {
    it('Return InvalidPinError, given pin is invalid', async () => {
      jest.spyOn(screenCloudService, 'validatePin').mockResolvedValue(false);

      const result = await accountService.getCurrentAccount('8888');

      expect(result).toBeInstanceOf(InvalidPinError);
    });

    it('Throw InternalServerErrorException, given current account is not found', async () => {
      jest.spyOn(screenCloudService, 'validatePin').mockResolvedValue(true);
      jest
        .spyOn(accountRepository, 'getCurrentBalance')
        .mockResolvedValue(null);

      await expect(
        accountService.getCurrentAccount('8888'),
      ).rejects.toBeInstanceOf(InternalServerErrorException);
    });

    it('Return Account, given current account is found and pin is valid', async () => {
      jest.spyOn(screenCloudService, 'validatePin').mockResolvedValue(true);
      jest
        .spyOn(accountRepository, 'getCurrentBalance')
        .mockResolvedValue({ id: 1, balance: 300 } as AccountEntity);

      const result = await accountService.getCurrentAccount('8888');

      expect(result).toBeInstanceOf(Account);
      expect(result).toEqual({ id: 1, balance: 300 });
    });
  });
});
