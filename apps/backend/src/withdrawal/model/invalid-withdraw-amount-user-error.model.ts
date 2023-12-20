import { ObjectType } from '@nestjs/graphql';
import { UserError } from 'src/common/error/user-error.model';

@ObjectType({ implements: () => [UserError] })
export class InvalidWithdrawAmountError extends UserError {
  constructor(message: string) {
    super('INVALID_WITHDRAW_AMOUNT_ERROR', message);
  }
}
