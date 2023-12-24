import { Button } from '@/components/ui-kits/Button';
import { InputPin } from '@/components/ui-kits/InputPin';
import { Modal } from '@/components/ui-kits/Modal';
import { FC, useState } from 'react';

interface IPinModal {
  onSubmitPin: (_pin: string) => void;
  isLoading?: boolean;
  isOpen: boolean;
  closeModal: () => void;
  openModal: () => void;
}

export const WelcomeModal: FC<IPinModal> = ({
  onSubmitPin,
  isLoading = false,
  isOpen,
  closeModal,
  openModal,
}) => {
  const [pin, setPin] = useState('');

  return (
    <Modal
      title="Welcome!"
      isOpen={isOpen}
      closeModal={closeModal}
      openModal={openModal}
      preventOutsideClick={true}
    >
      <form
        autoComplete="off"
        className="flex flex-col items-center gap-10"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmitPin(pin);
          setPin('');
        }}
      >
        <InputPin value={pin} onChange={setPin} numInputs={4} />
        <Button type="submit" disabled={!(pin.length === 4) || isLoading}>
          <p>Continue</p>
        </Button>
      </form>
    </Modal>
  );
};
