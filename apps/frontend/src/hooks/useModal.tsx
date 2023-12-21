import { useState } from 'react';

export const useModal = (defaultState: boolean = false) => {
  const [isOpen, setIsOpen] = useState(defaultState);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return {
    closeModal,
    openModal,
    toggleModal,
    isOpen,
  };
};
