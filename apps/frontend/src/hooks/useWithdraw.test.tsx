import { useWithdraw, isWithdrawSucceed } from '@/hooks/useWithdraw';
import { UserError } from '@/interfaces/UserError';
import { WithdrawSuccess } from '@/interfaces/WithdrawSuccess';
import { MUTATION_WITHDRAW } from '@/services/mutations/withdraw';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { act, renderHook } from '@testing-library/react';
import { FC, PropsWithChildren } from 'react';
import { toast } from 'react-toastify';

describe(useWithdraw.name, () => {
  const wrapper = (mocks: MockedResponse[]): FC<PropsWithChildren> => {
    const wrapper: FC<PropsWithChildren> = ({ children }) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    );

    return wrapper;
  };

  beforeAll(() => {
    jest.spyOn(toast, 'success');
    jest.spyOn(toast, 'error');
  });

  it('should return withdraw result and show success toast, given valid query', async () => {
    const mocks: MockedResponse[] = [
      {
        request: {
          query: MUTATION_WITHDRAW,
          variables: { pin: '8888', amount: 100 },
        },
        result: {
          data: {
            withdraw: {
              fiveNotes: 2,
              tenNotes: 3,
              twentyNotes: 3,
            },
          },
        },
      },
    ];

    const { result } = renderHook(() => useWithdraw(), {
      wrapper: wrapper(mocks),
    });

    await act(async () => {
      await result.current.mutationWithdraw({
        variables: { pin: '8888', amount: 100 },
      });
    });

    expect(result.current.withdrawResult).toEqual({
      withdraw: {
        fiveNotes: 2,
        tenNotes: 3,
        twentyNotes: 3,
      },
    });
    expect(toast.success).toBeCalledTimes(1);
    expect(toast.error).toBeCalledTimes(0);
  });

  it('should not return result and show error toast, given invalid query', async () => {
    const mocks: MockedResponse[] = [
      {
        request: {
          query: MUTATION_WITHDRAW,
          variables: { pin: '8888', amount: 100 },
        },
        result: {
          data: {
            withdraw: { code: 'OVERDRAWN_ERROR', message: 'Hello World' },
          },
        },
      },
    ];

    const { result } = renderHook(() => useWithdraw(), {
      wrapper: wrapper(mocks),
    });

    await act(async () => {
      await result.current.mutationWithdraw({
        variables: { pin: '8888', amount: 100 },
      });
    });

    expect(result.current.withdrawResult).toEqual({
      withdraw: { code: 'OVERDRAWN_ERROR', message: 'Hello World' },
    });
    expect(toast.success).toBeCalledTimes(0);
    expect(toast.error).toBeCalledTimes(1);
    expect(toast.error).toBeCalledWith('Hello World');
  });

  describe(isWithdrawSucceed, () => {
    it('returns false, given undefined', () => {
      const result = isWithdrawSucceed(undefined);

      expect(result).toBe(false);
    });

    it('returns false, given UserError', () => {
      const data: UserError = {
        code: 'OVERDRAWN_ERROR',
        message: 'Hello World',
      };

      const result = isWithdrawSucceed(data);

      expect(result).toBe(false);
    });

    it('returns true, given WithdrawSuccess', () => {
      const data: WithdrawSuccess = {
        fiveNotes: 2,
        tenNotes: 3,
        twentyNotes: 3,
      };

      const result = isWithdrawSucceed(data);

      expect(result).toBe(true);
    });
  });
});
