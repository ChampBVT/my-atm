import Home from '@/app/page';
import { AccountContext } from '@/contexts/AccountContext';
import { Account } from '@/interfaces/Account';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';

describe(Home.name, () => {
  const wrapper = (account: Account | null, mocks: MockedResponse[]) => (
    <AccountContext.Provider value={{ account, setAccount: jest.fn() }}>
      <MockedProvider mocks={mocks} addTypename={false}>
        <Home />
      </MockedProvider>
    </AccountContext.Provider>
  );

  it('renders WelcomeModal, given context account is null', async () => {
    render(wrapper(null, []));

    const homeContainer = (await screen.findByText('Welcome back!'))
      .parentElement;

    expect(homeContainer).toBeInTheDocument();
    expect(homeContainer).toHaveClass('opacity-0');

    // WelcomeModal
    expect(screen.getByText('Welcome!')).toBeInTheDocument();
  });

  it('renders main screen content, given context account is exist', async () => {
    render(wrapper({ balance: 500 }, []));

    const homeContainer = (await screen.findByText('Welcome back!'))
      .parentElement;

    expect(homeContainer).toBeInTheDocument();
    expect(homeContainer).toHaveClass('opacity-100');

    const balanceText = await screen.findByText('Balance', { exact: false });

    // WelcomeModal
    expect(balanceText).toHaveTextContent('Balance: £500');
  });
});
