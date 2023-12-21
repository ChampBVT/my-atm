import { AccountContext } from '@/contexts/AccountContext';
import { Account } from '@/interfaces/Account';
import { UserError } from '@/interfaces/UserError';
import { QUERY_INQUIRY_ACCOUNT } from '@/services/queries/inquiryAccount';
import { LazyQueryHookExecOptions, useLazyQuery } from '@apollo/client';
import { useContext } from 'react';
import { toast } from 'react-toastify';

interface IInquiryAccountData {
  viewer: {
    inquiry: {
      account: Account | UserError;
    };
  };
}

export const useInquiryAccount = () => {
  const { setAccount } = useContext(AccountContext);

  const [inquiryAccount, { loading, data }] = useLazyQuery<
    IInquiryAccountData,
    { pin: string }
  >(QUERY_INQUIRY_ACCOUNT, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      if ('code' in data.viewer.inquiry.account) {
        switch (data.viewer.inquiry.account.code) {
          default:
            toast.error(data.viewer.inquiry.account.message);
            return;
        }
      }

      setAccount(data.viewer.inquiry.account);
    },
  });

  return {
    fetchInquiryAccount: async (
      options: LazyQueryHookExecOptions<
        IInquiryAccountData,
        {
          pin: string;
        }
      >,
      showSuccessToast = true,
    ) => {
      await inquiryAccount(options);
      if (data && 'code' in data.viewer.inquiry.account && showSuccessToast)
        toast.success('Success!');
    },
    isInquiryAccountLoading: loading,
  };
};
