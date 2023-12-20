import { Injectable } from '@nestjs/common';
import { AccountEntity } from 'src/account/account.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AccountRepository extends Repository<AccountEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(AccountEntity, dataSource.createEntityManager());
  }

  async getCurrentBalance(): Promise<AccountEntity | null> {
    return this.findOneBy({});
  }

  async updateBalanceById(id: number, balance: number): Promise<void> {
    await this.update(id, { balance });
  }
}
