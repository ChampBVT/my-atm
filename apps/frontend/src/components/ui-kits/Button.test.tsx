import { Button } from '@/components/ui-kits/Button';
import { render } from '@testing-library/react';

describe(Button.name, () => {
  it('renders Button correctly with default variant', () => {
    const { container } = render(
      <Button type="submit" disabled className="test-classname">
        <p>HELLO</p>
      </Button>,
    );

    const button = container.querySelector('button');

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('HELLO');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveClass('bg-blue-500', 'test-classname');
    expect(button).toBeDisabled();
  });

  it('renders Button correctly with green variant', () => {
    const { container } = render(
      <Button type="button" variant="green">
        <p>HELLO</p>
      </Button>,
    );

    const button = container.querySelector('button');

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('HELLO');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('bg-green-500');
    expect(button).not.toBeDisabled();
  });
});
