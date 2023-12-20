import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { AccountEntity } from 'src/account/account.entity';

@ObjectType()
export class Account {
  constructor(params: AccountEntity) {
    Object.assign(this, params);
  }

  @Field(() => Number)
  balance: number;

  @HideField()
  id: number;

  static from(accountEntity: AccountEntity): Account {
    return new Account({
      balance: accountEntity.balance,
      id: accountEntity.id,
    });
  }
}
