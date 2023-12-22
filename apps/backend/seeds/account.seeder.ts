import { AccountEntity } from 'src/account/account.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class AccountSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(AccountEntity);

    await repository.clear();

    const account = repository.create({ balance: 400 });

    await repository.save(account);
  }
}
