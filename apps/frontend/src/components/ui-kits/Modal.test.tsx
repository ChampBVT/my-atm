import { Modal } from '@/components/ui-kits/Modal';
import { render, screen } from '@testing-library/react';

describe(Modal.name, () => {
  it('renders Modal, given state isOpen is true', async () => {
    render(
      <Modal
        title="Modal title"
        isOpen={true}
        openModal={() => {}}
        closeModal={() => {}}
      >
        {/* https://github.com/tailwindlabs/headlessui/issues/407 */}
        <button className="h-0 w-0 overflow-hidden" />
        {/*  */}
        <p>This is inside modal</p>
      </Modal>,
    );

    const modal = await screen.findByRole('dialog', { hidden: true });
    const modalHeading = await screen.findByRole('heading', { level: 3 });

    expect(modal).toBeInTheDocument();
    expect(modalHeading).toBeInTheDocument();
    expect(modalHeading).toHaveTextContent('Modal title');
    expect(modal).toHaveTextContent('This is inside modal');
  });

  it('renders nothing, given state isOpen is false', async () => {
    render(
      <Modal
        title="Modal title"
        isOpen={false}
        openModal={() => {}}
        closeModal={() => {}}
      >
        <p>This is inside modal</p>
      </Modal>,
    );

    const modal = screen.queryByRole('dialog', { hidden: true });

    expect(modal).not.toBeInTheDocument();
  });
});
