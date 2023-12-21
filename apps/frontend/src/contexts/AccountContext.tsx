import { Account } from '@/interfaces/Account';
import { Dispatch, createContext } from 'react';

interface IAccountContext {
  account: Account | null;
  setAccount: Dispatch<{ balance: number }>;
}

export const ACCOUNT_CONTEXT_DEFAULT = {
  account: null,
  setAccount: () => {},
};

export const AccountContext = createContext<IAccountContext>(
  ACCOUNT_CONTEXT_DEFAULT,
);
