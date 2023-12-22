import { createUnionType } from '@nestjs/graphql';
import { Account } from 'src/account/model/account.model';
import { InvalidPinError } from 'src/common/error/invalid-pin-error.model';

export const AccountPayload = createUnionType({
  name: 'AccountPayload',
  types: () => [Account, InvalidPinError],
});
