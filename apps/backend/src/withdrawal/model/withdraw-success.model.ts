import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class WithdrawSuccess {
  constructor(param: WithdrawSuccess) {
    Object.assign(this, param);
  }

  @Field(() => Number)
  fiveNotes: number;

  @Field(() => Number)
  tenNotes: number;

  @Field(() => Number)
  twentyNotes: number;

  static from(param: WithdrawSuccess): WithdrawSuccess {
    return new WithdrawSuccess(param);
  }
}
