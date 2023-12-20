import { ObjectType } from '@nestjs/graphql';
import { UserError } from 'src/common/error/user-error.model';

@ObjectType({ implements: () => [UserError] })
export class InsufficientNoteError extends UserError {
  constructor(message: string) {
    super('INSUFFICIENT_NOTE_ERROR', message);
  }
}
