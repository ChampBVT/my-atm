import { InputPin } from '@/components/ui-kits/InputPin';
import { fireEvent, render } from '@testing-library/react';

describe(InputPin.name, () => {
  it('renders InputPin correctly with default variant', () => {
    const { container } = render(
      <InputPin value={'1111'} onChange={() => {}} numInputs={4} />,
    );

    const inputs = container.querySelectorAll('input');

    inputs.forEach((input) => {
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'password');
      expect(input).toHaveValue('1');
    });
  });

  it('renders InputPin trigger onChange and rerender correctly', () => {
    let value = '10';
    const onChange = jest.fn().mockImplementation((inputValue) => {
      value = inputValue;
    });

    const { container, rerender } = render(
      <InputPin value={value} onChange={onChange} numInputs={4} />,
    );

    const firstInputs = container.querySelector('input');

    fireEvent.change(firstInputs!, { target: { value: '0' } });

    rerender(<InputPin value={value} onChange={onChange} numInputs={4} />);

    expect(firstInputs).toHaveValue('0');
    expect(onChange).toHaveBeenCalledWith('00');
  });
});
