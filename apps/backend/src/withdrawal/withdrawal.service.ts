import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { chain, cloneDeep, pickBy } from 'lodash';
import { StorageEntity } from 'src/storage/storage.entity';
import { StorageService } from 'src/storage/storage.service';
import { NOTE_VALUES } from 'src/withdrawal/constant/note-value.constant';
import { AccountService } from 'src/account/account.service';
import { Transactional } from 'typeorm-transactional';
import { WithdrawPayload } from 'src/withdrawal/model/withdraw-payload.union';
import { WithdrawSuccess } from 'src/withdrawal/model/withdraw-success.model';
import { OverdrawnError } from 'src/withdrawal/model/overdrawn-user-error.model';
import { InsufficientNoteError } from 'src/withdrawal/model/insufficient-note-user-error.model';
import { InvalidWithdrawAmountError } from 'src/withdrawal/model/invalid-withdraw-amount-user-error.model';
import { Account } from 'src/account/model/account.model';
import { InvalidPinError } from 'src/common/error/invalid-pin-error.model';
import { UserError } from 'src/common/error/user-error.model';

@Injectable()
export class WithdrawalService {
  private readonly OVERDRAWN_LIMIT = 100;

  constructor(
    private readonly storageService: StorageService,
    private readonly accountService: AccountService,
  ) {}

  @Transactional()
  async withdraw(
    pin: string,
    amountToWithdraw: number,
  ): Promise<typeof WithdrawPayload> {
    const account = await this.accountService.getCurrentAccount(pin);

    if (!(account instanceof Account)) {
      return new InvalidPinError('Invalid or missing pin');
    }

    const accountBalance = account.balance;

    if (amountToWithdraw > accountBalance + this.OVERDRAWN_LIMIT) {
      return new OverdrawnError('Withdrawal amount exceeds available balance');
    }

    const storage = await this.storageService.getCurrentStorage();

    const availableNoteValues = this.getAvailableNoteValues(storage);

    if (availableNoteValues.length < 1) {
      return new InsufficientNoteError('Insufficient bank notes');
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const smallestAvailableNote = availableNoteValues.at(-1)!;

    if (amountToWithdraw % smallestAvailableNote[1] !== 0) {
      return new InvalidWithdrawAmountError(
        'Available notes cannot fulfill the withdrawal amount',
      );
    }

    if (
      amountToWithdraw > storage.totalValue ||
      amountToWithdraw < smallestAvailableNote[1]
    ) {
      return new InsufficientNoteError('Insufficient bank notes');
    }

    try {
      const { withdrawNotes, updatedStorage } = this.calculateWithdrawal({
        amountToWithdraw,
        availableNoteValues,
        storage,
      });

      await this.storageService.updateCurrentStorageById(
        storage.id,
        updatedStorage,
      );

      await this.accountService.updateCurrentBalanceById(
        account.id,
        accountBalance - amountToWithdraw,
      );

      return WithdrawSuccess.from(withdrawNotes);
    } catch (error) {
      if (error instanceof UserError) {
        return error;
      }

      throw new InternalServerErrorException();
    }
  }

  calculateWithdrawal({
    availableNoteValues,
    amountToWithdraw,
    storage,
  }: {
    availableNoteValues: [string, number][];
    amountToWithdraw: number;
    storage: StorageEntity;
  }): {
    withdrawNotes: Pick<
      StorageEntity,
      'fiveNotes' | 'tenNotes' | 'twentyNotes'
    >;
    updatedStorage: StorageEntity;
  } {
    const withdrawNotes: Pick<
      StorageEntity,
      'fiveNotes' | 'tenNotes' | 'twentyNotes'
    > = {
      fiveNotes: 0,
      tenNotes: 0,
      twentyNotes: 0,
    };

    const temporaryStorage = cloneDeep(storage);
    let remainingAmountToWithdraw = amountToWithdraw;

    const canWithdrawNote = (note: string, noteValue: number): boolean => {
      const noteStorageCount = temporaryStorage[note];

      if (remainingAmountToWithdraw === noteValue && noteStorageCount === 0) {
        return false;
      }

      if (remainingAmountToWithdraw - noteValue < 0 || noteStorageCount === 0) {
        return false;
      }

      if (
        noteStorageCount === 1 &&
        availableNoteValues
          .filter(
            ([key, value]) =>
              key !== note &&
              temporaryStorage[key] > 0 &&
              value <= remainingAmountToWithdraw,
          )
          .some(
            ([, value]) =>
              (remainingAmountToWithdraw - noteValue) % value !== 0,
          )
      ) {
        return false;
      }

      return true;
    };

    while (remainingAmountToWithdraw > 0) {
      for (const [note, noteValue] of availableNoteValues) {
        if (!canWithdrawNote(note, noteValue)) {
          continue;
        }

        remainingAmountToWithdraw -= noteValue;
        temporaryStorage[note] -= 1;
        withdrawNotes[note] += 1;
      }
    }

    if (remainingAmountToWithdraw > 0) {
      throw new InsufficientNoteError('Insufficient bank notes');
    }

    return { withdrawNotes, updatedStorage: temporaryStorage };
  }

  /**
   * @description Create sorted map by note value (DESC)
   */
  getAvailableNoteValues(storage: StorageEntity): [string, number][] {
    const notesWithPositiveCount = pickBy(
      storage,
      (value, key) => key in NOTE_VALUES && value > 0,
    );

    // Using map to preserve ordering
    const sortedNoteValues = new Map<string, number>(
      chain(notesWithPositiveCount)
        .keys()
        .map((key) => [key, NOTE_VALUES[key]])
        .sort((a, b) => b[1] - a[1])
        .value() as [string, number][],
    );

    return Array.from(sortedNoteValues);
  }
}
