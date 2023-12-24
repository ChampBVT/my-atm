import { render, fireEvent, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import { WithdrawModal } from './WithdrawModal';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { MUTATION_WITHDRAW } from '@/services/mutations/withdraw';

describe(WithdrawModal.name, () => {
  it('renders the amount form correctly', async () => {
    render(
      <MockedProvider>
        <WithdrawModal
          isOpen={true}
          closeModal={() => {}}
          openModal={() => {}}
          refetchInquiryAccount={() => {}}
        />
      </MockedProvider>,
    );

    const amountInput = await screen.findByLabelText('Amount:');
    const confirmButton = (await screen.findByText('Confirm')).parentElement;
    const cancelButton = (await screen.findByText('Cancel')).parentElement;

    expect(amountInput).toBeInTheDocument();
    expect(confirmButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  it('should not render the amount form, given isOpen is false', async () => {
    render(
      <MockedProvider>
        <WithdrawModal
          isOpen={false}
          closeModal={() => {}}
          openModal={() => {}}
          refetchInquiryAccount={() => {}}
        />
      </MockedProvider>,
    );

    const amountInput = screen.queryByLabelText('Amount:');
    const confirmButton = screen.queryByText('Confirm')?.parentElement || null;
    const cancelButton = screen.queryByText('Cancel')?.parentElement || null;

    expect(amountInput).not.toBeInTheDocument();
    expect(confirmButton).not.toBeInTheDocument();
    expect(cancelButton).not.toBeInTheDocument();
  });

  it('allows entering the withdrawal amount and proceeds to pin entry', async () => {
    render(
      <MockedProvider>
        <WithdrawModal
          isOpen={true}
          closeModal={() => {}}
          openModal={() => {}}
          refetchInquiryAccount={() => {}}
        />
      </MockedProvider>,
    );

    const amountInput = await screen.findByLabelText('Amount:');
    const confirmButton = (await screen.findByText('Confirm'))?.parentElement;

    expect(confirmButton).toBeDisabled();

    act(() => {
      fireEvent.change(amountInput!, { target: { value: '20' } });
      expect(confirmButton).not.toBeDisabled();
      fireEvent.click(confirmButton!);
    });

    await expect(
      screen.findByText('Withdrawal (£20)'),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText('Enter your PIN'),
    ).resolves.toBeInTheDocument();
    await expect(screen.findByText('Back')).resolves.toBeInTheDocument();
  });

  it('handles pin entry and displays success state', async () => {
    const mocks: MockedResponse[] = [
      {
        request: {
          query: MUTATION_WITHDRAW,
          variables: { pin: '0123', amount: 20 },
        },
        result: {
          data: {
            withdraw: {
              fiveNotes: 4,
              tenNotes: 8,
              twentyNotes: 16,
            },
          },
        },
      },
    ];

    const mockRefetchInquiryAccount = jest.fn();

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <WithdrawModal
          isOpen={true}
          closeModal={() => {}}
          openModal={() => {}}
          refetchInquiryAccount={mockRefetchInquiryAccount}
        />
      </MockedProvider>,
    );

    const amountInput = await screen.findByLabelText('Amount:');
    const confirmButton = (await screen.findByText('Confirm'))?.parentElement;

    expect(confirmButton).toBeDisabled();

    act(() => {
      // Enter a withdrawal amount
      fireEvent.change(amountInput, { target: { value: 20 } });
      expect(confirmButton).not.toBeDisabled();
      fireEvent.click(confirmButton!);
    });

    // Enter a pin
    const pinInput = await screen.findAllByLabelText((label) =>
      label.includes('Please enter OTP character'),
    );
    const confirmPinButton = (await screen.findByText('Confirm')).parentElement;

    expect(confirmPinButton).toBeDisabled();

    act(() => {
      pinInput.forEach((input, idx) => {
        fireEvent.change(input, { target: { value: idx } });
      });
      expect(confirmPinButton).not.toBeDisabled();
      fireEvent.click(confirmPinButton!);
    });

    // Withdraw success
    await expect(screen.findByText('Summary')).resolves.toBeInTheDocument();
    const summaryNotes = await screen.findAllByText(/x \d+/);

    expect(summaryNotes.map((note) => note.textContent)).toEqual([
      '£5 x 4',
      '£10 x 8',
      '£20 x 16',
    ]);
    await expect(
      screen.findByText('Return to menu'),
    ).resolves.toBeInTheDocument();
    expect(mockRefetchInquiryAccount).toBeCalledTimes(1);
  });
});
