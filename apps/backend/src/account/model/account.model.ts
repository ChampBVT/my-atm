import { Field, HideField, Int, ObjectType } from '@nestjs/graphql';
import { AccountEntity } from 'src/account/account.entity';

@ObjectType()
export class Account {
  constructor(params: AccountEntity) {
    Object.assign(this, params);
  }

  @Field(() => Int)
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
