import { UserError } from '@/interfaces/UserError';
import { WithdrawSuccess } from '@/interfaces/WithdrawSuccess';
import { MUTATION_WITHDRAW } from '@/services/mutations/withdraw';
import { useMutation } from '@apollo/client';

import { toast } from 'react-toastify';

interface IWithdrawData {
  withdraw: WithdrawSuccess | UserError;
}

const isWithdrawSucceed = (
  withdraw: WithdrawSuccess | UserError | undefined,
): withdraw is WithdrawSuccess => {
  if (!withdraw) return false;

  return (withdraw as UserError).code === undefined;
};

export const useWithdraw = () => {
  const withdraw = useMutation<IWithdrawData, { pin: string; amount: number }>(
    MUTATION_WITHDRAW,
    {
      fetchPolicy: 'no-cache',
      onCompleted: (data) => {
        if ('code' in data.withdraw) {
          switch (data.withdraw.code) {
            default:
              toast.error(data.withdraw.message);
              return;
          }
        }

        toast.success('Success!');
      },
    },
  );

  return {
    mutationWithdraw: withdraw[0],
    isWithdrawLoading: withdraw[1].loading,
    withdrawResult: withdraw[1].data,
    isWithdrawSucceed,
  };
};
