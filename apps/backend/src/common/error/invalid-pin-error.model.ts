import { ObjectType } from '@nestjs/graphql';
import { UserError } from 'src/common/error/user-error.model';

@ObjectType({ implements: () => [UserError] })
export class InvalidPinError extends UserError {
  constructor(message: string) {
    super('INVALID_PIN_ERROR', message);
  }
}
