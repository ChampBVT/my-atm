import { Fragment, FC, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import classNames from 'classnames';

interface IModal {
  children: ReactNode;
  title: string;
  isOpen: boolean;
  closeModal: () => void;
  openModal: () => void;
  preventOutsideClick?: boolean;
}

export const Modal: FC<IModal> = ({
  children,
  title,
  isOpen,
  openModal: _openModal,
  closeModal,
  preventOutsideClick = false,
}) => {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => (preventOutsideClick ? undefined : closeModal())}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  as="div"
                  className={classNames(
                    'rounded-2xl bg-gray-100 p-8 sm:p-10 text-left align-middle shadow-xl transition-all h-full',
                    'w-full max-w-5xl transform overflow-hidden',
                  )}
                >
                  <h3 className="text-2xl sm:text-5xl font-bold pb-10 self-start">
                    {title}
                  </h3>
                  <div className="flex h-full justify-center items-center flex-col gap-12">
                    {children}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
