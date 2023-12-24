import { AccountContext } from '@/contexts/AccountContext';
import { useInquiryAccount } from '@/hooks/useInquiryAccount';
import { QUERY_INQUIRY_ACCOUNT } from '@/services/queries/inquiryAccount';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { act, renderHook } from '@testing-library/react';
import { FC, PropsWithChildren } from 'react';
import { toast } from 'react-toastify';

describe(useInquiryAccount.name, () => {
  const setAccount = jest.fn();

  const wrapper = (mocks: MockedResponse[]): FC<PropsWithChildren> => {
    const wrapper: FC<PropsWithChildren> = ({ children }) => (
      <AccountContext.Provider value={{ account: { balance: 0 }, setAccount }}>
        <MockedProvider mocks={mocks} addTypename={false}>
          {children}
        </MockedProvider>
      </AccountContext.Provider>
    );

    return wrapper;
  };

  beforeAll(() => {
    jest.spyOn(toast, 'success');
    jest.spyOn(toast, 'error');
  });

  it('should set account balance and show success toast, given valid query', async () => {
    const mocks: MockedResponse[] = [
      {
        request: { query: QUERY_INQUIRY_ACCOUNT, variables: { pin: '8888' } },
        result: {
          data: {
            viewer: {
              inquiry: {
                account: { balance: 500 },
              },
            },
          },
        },
      },
    ];

    const { result } = renderHook(() => useInquiryAccount(), {
      wrapper: wrapper(mocks),
    });

    await act(async () => {
      await result.current.fetchInquiryAccount({ variables: { pin: '8888' } });
    });

    expect(toast.success).toBeCalledTimes(1);
    expect(toast.error).toBeCalledTimes(0);
    expect(setAccount).toBeCalledTimes(1);
    expect(setAccount).toBeCalledWith({ balance: 500 });
  });

  it('should set account balance but not success toast, given valid query and showSuccessToast false', async () => {
    const mocks: MockedResponse[] = [
      {
        request: { query: QUERY_INQUIRY_ACCOUNT, variables: { pin: '8888' } },
        result: {
          data: {
            viewer: {
              inquiry: {
                account: { balance: 500 },
              },
            },
          },
        },
      },
    ];

    const { result } = renderHook(() => useInquiryAccount(), {
      wrapper: wrapper(mocks),
    });

    await act(async () => {
      await result.current.fetchInquiryAccount(
        { variables: { pin: '8888' } },
        false,
      );
    });

    expect(toast.success).toBeCalledTimes(0);
    expect(toast.error).toBeCalledTimes(0);
    expect(setAccount).toBeCalledTimes(1);
    expect(setAccount).toBeCalledWith({ balance: 500 });
  });

  it('should not set account balance and show error toast, given invalid query', async () => {
    const mocks: MockedResponse[] = [
      {
        request: { query: QUERY_INQUIRY_ACCOUNT, variables: { pin: '8888' } },
        result: {
          data: {
            viewer: {
              inquiry: {
                account: { code: 'USER_ERROR', message: 'Hello World' },
              },
            },
          },
        },
      },
    ];

    const { result } = renderHook(() => useInquiryAccount(), {
      wrapper: wrapper(mocks),
    });

    await act(async () => {
      await result.current.fetchInquiryAccount({ variables: { pin: '8888' } });
    });

    expect(toast.success).toBeCalledTimes(0);
    expect(toast.error).toBeCalledTimes(1);
    expect(toast.error).toBeCalledWith('Hello World');
    expect(setAccount).toBeCalledTimes(0);
  });
});
