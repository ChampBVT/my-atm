import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { chain, cloneDeep, pickBy, pick } from 'lodash';
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
    try {
      const account = await this.accountService.getCurrentAccount(pin);

      if (!(account instanceof Account)) {
        return new InvalidPinError('Invalid or missing pin');
      }

      const accountBalance = account.balance;

      if (amountToWithdraw > accountBalance + this.OVERDRAWN_LIMIT) {
        return new OverdrawnError(
          'Withdrawal amount exceeds available balance',
        );
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

      if (amountToWithdraw > storage.totalValue) {
        return new InsufficientNoteError('Insufficient bank notes');
      }

      const { withdrawNotes, updatedStorage } = this.calculateWithdrawal({
        amountToWithdraw,
        availableNoteValues,
        storage: pick(storage, ['fiveNotes', 'tenNotes', 'twentyNotes']),
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

      throw new InternalServerErrorException('Withdrawal Error', {
        cause: error,
      });
    }
  }

  /**
   * @description Calculate the most even mix of bank note for withdrawal
   */
  calculateWithdrawal({
    availableNoteValues,
    amountToWithdraw,
    storage,
  }: {
    availableNoteValues: [string, number][];
    amountToWithdraw: number;
    storage: Pick<StorageEntity, 'fiveNotes' | 'tenNotes' | 'twentyNotes'>;
  }): {
    // The bank notes to be withdrawn
    withdrawNotes: Pick<
      StorageEntity,
      'fiveNotes' | 'tenNotes' | 'twentyNotes'
    >;
    // The updated storage after the withdrawal
    updatedStorage: Pick<
      StorageEntity,
      'fiveNotes' | 'tenNotes' | 'twentyNotes'
    >;
  } {
    // Calculate the total value of available notes
    const totalValueOfAvailableNotes = availableNoteValues.reduce(
      (acc, [, noteValue]) => acc + noteValue,
      0,
    );

    // Extract the count of each available note from the storage
    const noteCountStorageArray = Object.values(
      pick(
        storage,
        availableNoteValues.map(([note]) => note),
      ),
    );

    // Determine the maximum number of times all available notes can be withdrawn
    const maxWithdrawAllCount = Math.min(
      Math.floor(amountToWithdraw / totalValueOfAvailableNotes),
      ...noteCountStorageArray,
    );

    let currentWithdrawAllCount = maxWithdrawAllCount;

    // Iterate while there are still attempts to withdraw all available notes
    while (currentWithdrawAllCount >= 0) {
      const temporaryStorage = cloneDeep(storage);

      // Initialize the withdrawn notes with currentWithdrawAllCount offset
      // If the note is not in availableNoteValues will initialize as 0
      const withdrawNotes: Pick<
        StorageEntity,
        'fiveNotes' | 'tenNotes' | 'twentyNotes'
      > = {
        fiveNotes:
          temporaryStorage['fiveNotes'] &&
          availableNoteValues.find(([note]) => note === 'fiveNotes')
            ? currentWithdrawAllCount
            : 0,
        tenNotes:
          temporaryStorage['tenNotes'] &&
          availableNoteValues.find(([note]) => note === 'tenNotes')
            ? currentWithdrawAllCount
            : 0,
        twentyNotes:
          temporaryStorage['twentyNotes'] &&
          availableNoteValues.find(([note]) => note === 'twentyNotes')
            ? currentWithdrawAllCount
            : 0,
      };

      // Calculate the remaining amount to be withdrawn
      let remainingAmountToWithdraw =
        amountToWithdraw - totalValueOfAvailableNotes * currentWithdrawAllCount;

      // Adjust the temporary storage based on the withdrawal attempt (currentWithdrawAllCount)
      Object.entries(temporaryStorage).forEach(([note]) => {
        if (availableNoteValues.find(([noteName]) => noteName === note)) {
          temporaryStorage[note] =
            temporaryStorage[note] - currentWithdrawAllCount;
        }
      });

      // Iterate through available note values to complete the withdrawal
      for (const [note, noteValue] of availableNoteValues) {
        while (remainingAmountToWithdraw > 0) {
          if (
            temporaryStorage[note] <= 0 ||
            remainingAmountToWithdraw - noteValue < 0
          ) {
            break;
          }

          remainingAmountToWithdraw -= noteValue;
          temporaryStorage[note] -= 1;
          withdrawNotes[note] += 1;
        }
      }

      // If the withdrawal is not successful, decrease the currentWithdrawAllCount
      // for more withdrawal possibility
      if (remainingAmountToWithdraw > 0) {
        currentWithdrawAllCount--;

        // If no more attempts left, re-run the calculation without the note count causing the issue
        if (currentWithdrawAllCount === 0) {
          return this.calculateWithdrawal({
            amountToWithdraw,
            availableNoteValues: availableNoteValues.filter(
              ([note]) => storage[note] !== maxWithdrawAllCount,
            ),
            storage: storage,
          });
        }
      } else {
        // Successful withdrawal, return the result
        return { withdrawNotes, updatedStorage: temporaryStorage };
      }
    }

    // If the loop exits without a successful withdrawal, throw an error
    throw new InvalidWithdrawAmountError(
      'Available notes cannot fulfill the withdrawal amount',
    );
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
