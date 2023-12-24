import { WelcomeModal } from '@/components/WelcomeModal';
import {
  fireEvent,
  waitFor,
  render,
  screen,
  act,
} from '@testing-library/react';

describe(WelcomeModal.name, () => {
  const mockSubmitPin = jest.fn();
  const mockCloseModal = jest.fn();
  const mockOpenModal = jest.fn();

  const defaultProps = {
    onSubmitPin: mockSubmitPin,
    isOpen: true,
    closeModal: mockCloseModal,
    openModal: mockOpenModal,
  };

  it('renders WelcomeModal correctly', async () => {
    render(<WelcomeModal {...defaultProps} />);

    const pinInput = await screen.findAllByLabelText((label) =>
      label.includes('Please enter OTP character'),
    );

    expect(screen.getByText('Welcome!')).toBeInTheDocument();
    expect(screen.getByText('Continue')).toBeInTheDocument();
    expect(pinInput.length).toBe(4);
  });

  it('should not render WelcomeModal correctly', async () => {
    render(<WelcomeModal {...defaultProps} isOpen={false} />);

    const pinInput = screen.queryAllByLabelText((label) =>
      label.includes('Please enter OTP character'),
    );

    expect(screen.queryByText('Welcome!')).not.toBeInTheDocument();
    expect(screen.queryByText('Continue')).not.toBeInTheDocument();
    expect(pinInput.length).toBe(0);
  });

  it('calls onSubmitPin with correct pin and resets pin on button click', async () => {
    render(<WelcomeModal {...defaultProps} />);

    const pinInput = await screen.findAllByLabelText((label) =>
      label.includes('Please enter OTP character'),
    );
    const continueButton = screen.getByText('Continue').parentElement;

    expect(continueButton).toBeDisabled();

    // Enter pin
    act(() => {
      pinInput.forEach((input, idx) => {
        fireEvent.change(input, { target: { value: idx } });
      });

      expect(continueButton).not.toBeDisabled();
      // Click continue button
      fireEvent.click(continueButton!);
    });

    // Ensure onSubmitPin is called with correct pin
    expect(mockSubmitPin).toHaveBeenCalledWith('0123');

    // Ensure pin is reset
    await waitFor(() =>
      pinInput.forEach((input) => {
        expect(input).toHaveTextContent('');
      }),
    );
  });
});
