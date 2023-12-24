import { Input } from '@/components/ui-kits/Input';
import { render } from '@testing-library/react';

describe(Input.name, () => {
  it('renders Input correctly', () => {
    const { container } = render(
      <Input type="number" disabled className="test-classname" />,
    );

    const input = container.querySelector('input');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveClass('test-classname');
    expect(input).toBeDisabled();
  });
});
