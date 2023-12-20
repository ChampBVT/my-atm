import { createUnionType } from '@nestjs/graphql';
import { InvalidPinError } from 'src/common/error/invalid-pin-error.model';
import { InsufficientNoteError } from 'src/withdrawal/model/insufficient-note-user-error.model';
import { InvalidWithdrawAmountError } from 'src/withdrawal/model/invalid-withdraw-amount-user-error.model';
import { OverdrawnError } from 'src/withdrawal/model/overdrawn-user-error.model';
import { WithdrawSuccess } from 'src/withdrawal/model/withdraw-success.model';

export const WithdrawPayload = createUnionType({
  name: 'WithdrawPayload',
  types: () => [
    WithdrawSuccess,
    OverdrawnError,
    InvalidWithdrawAmountError,
    InsufficientNoteError,
    InvalidPinError,
  ],
});
