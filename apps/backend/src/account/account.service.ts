import { UserInputError } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';

import { Account } from 'src/account/model/account.model';
import { AccountRepository } from 'src/account/account.repository';
import { ScreenCloudService } from 'src/common/external/screencloud/screencloud.service';
import { AccountPayload } from 'src/account/account-payload.union';
import { InvalidPinError } from 'src/common/error/invalid-pin-error.model';

@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly screenCloudService: ScreenCloudService,
  ) {}

  async getCurrentAccount(pin: string): Promise<typeof AccountPayload> {
    const isPinValid = await this.screenCloudService.validatePin(pin);

    if (!isPinValid) {
      return new InvalidPinError('Invalid or missing pin');
    }

    const accountEntity = await this.accountRepository.findOneBy({});

    if (!accountEntity) {
      throw new UserInputError('No balance found');
    }

    return Account.from(accountEntity);
  }

  async updateCurrentBalanceById(id: number, balance: number): Promise<void> {
    await this.accountRepository.update(id, { balance });
  }
}
