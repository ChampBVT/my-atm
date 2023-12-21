'use client';
import {
  ACCOUNT_CONTEXT_DEFAULT,
  AccountContext,
} from '@/contexts/AccountContext';
import { Account } from '@/interfaces/Account';
import { ApolloWrapper } from '@/services/apolloWrapper';
import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';

export const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<Account | null>(
    ACCOUNT_CONTEXT_DEFAULT.account,
  );

  return (
    <ApolloWrapper>
      <AccountContext.Provider value={{ account, setAccount }}>
        {children}
      </AccountContext.Provider>
      <ToastContainer />
    </ApolloWrapper>
  );
};
