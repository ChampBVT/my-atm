import { Button } from '@/components/ui-kits/Button';
import { InputPin } from '@/components/ui-kits/InputPin';
import { Modal } from '@/components/ui-kits/Modal';
import { FC } from 'react';

interface IPinModal {
  title: string;
  inputValue: string;
  inputOnChange: (_value: string) => void;
  onClickButton: () => void;
  buttonLabel: string;
  isLoading?: boolean;
  isOpen: boolean;
  closeModal: () => void;
  openModal: () => void;
  preventOutsideClick?: boolean;
}

export const WelcomeModal: FC<IPinModal> = ({
  title,
  inputValue,
  inputOnChange,
  onClickButton,
  buttonLabel,
  isLoading = false,
  isOpen,
  closeModal,
  openModal,
  preventOutsideClick = false,
}) => {
  return (
    <Modal
      title={title}
      isOpen={isOpen}
      closeModal={closeModal}
      openModal={openModal}
      preventOutsideClick={preventOutsideClick}
    >
      <form autoComplete="off" className="flex flex-col items-center gap-10">
        <InputPin value={inputValue} onChange={inputOnChange} numInputs={4} />
        <Button
          type="submit"
          disabled={!(inputValue.length === 4) || isLoading}
          onClick={onClickButton}
        >
          <p>{buttonLabel}</p>
        </Button>
      </form>
    </Modal>
  );
};
