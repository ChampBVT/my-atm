import { ObjectType } from '@nestjs/graphql';
import { UserError } from 'src/common/error/user-error.model';

@ObjectType({ implements: () => [UserError] })
export class OverdrawnError extends UserError {
  constructor(message: string) {
    super('OVERDRAWN_ERROR', message);
  }
}
