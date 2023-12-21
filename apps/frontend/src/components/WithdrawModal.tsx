import { Button } from '@/components/ui-kits/Button';
import { Input } from '@/components/ui-kits/Input';
import { InputPin } from '@/components/ui-kits/InputPin';
import { Modal } from '@/components/ui-kits/Modal';
import { useWithdraw } from '@/hooks/useWithdraw';
import { DotLottiePlayer } from '@dotlottie/react-player';
import { FC, useEffect, useState } from 'react';

interface IPinModal {
  refetchInquiryAccount: (_pin: string) => void;
  isOpen: boolean;
  closeModal: () => void;
  openModal: () => void;
}

export const WithdrawModal: FC<IPinModal> = ({
  refetchInquiryAccount,
  isOpen,
  closeModal,
  openModal,
}) => {
  const [step, setStep] = useState<'amount' | 'pin' | 'succeed'>('amount');
  const [pin, setPin] = useState('');
  // Use for re-fetching account balance
  const [tempPin, setTempPin] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState<number | undefined>(
    undefined,
  );

  const {
    isWithdrawLoading,
    withdrawResult,
    mutationWithdraw,
    isWithdrawSucceed,
  } = useWithdraw();

  useEffect(() => {
    if (isWithdrawSucceed(withdrawResult?.withdraw)) {
      setStep('succeed');
      refetchInquiryAccount(tempPin);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWithdrawSucceed, withdrawResult?.withdraw]);

  const closeWithdrawModal = () => {
    setTimeout(() => {
      setWithdrawAmount(undefined);
      setStep('amount');
      setPin('');
    }, 300);
    closeModal();
  };

  return (
    <Modal
      title={
        step === 'amount' ? 'Withdrawal' : `Withdrawal (£${withdrawAmount})`
      }
      isOpen={isOpen}
      closeModal={closeModal}
      openModal={openModal}
      preventOutsideClick={true}
    >
      {step === 'amount' && (
        <form
          autoComplete="off"
          className="flex flex-col items-center gap-10 w-full"
          onSubmit={(event) => {
            event.preventDefault();
            setStep('pin');
          }}
        >
          <div className="flex flex-row items-center justify-around w-4/6">
            <label className="mr-4 font-bold text-2xl">Amount: </label>
            <Input
              className="w-full"
              type="number"
              value={withdrawAmount ?? ''}
              onChange={(event) => {
                event.target.value
                  ? setWithdrawAmount(parseInt(event.target.value))
                  : setWithdrawAmount(undefined);
              }}
            />
          </div>
          <div className="flex flex-row gap-10">
            <Button
              type="button"
              onClick={() => closeWithdrawModal()}
              variant="red"
            >
              <p>Cancel</p>
            </Button>
            <Button
              type="submit"
              disabled={withdrawAmount ? withdrawAmount < 1 : true}
            >
              <p>Confirm</p>
            </Button>
          </div>
        </form>
      )}

      {step === 'pin' && (
        <form
          autoComplete="off"
          className="flex flex-col items-center gap-10"
          onSubmit={async (event) => {
            event.preventDefault();
            await mutationWithdraw({
              variables: { pin, amount: withdrawAmount! },
            });
            setTempPin(pin);
            setPin('');
          }}
        >
          <InputPin
            value={pin}
            onChange={(value) => setPin(value)}
            numInputs={4}
          />
          <div className="flex flex-row gap-10">
            <Button
              type="button"
              onClick={() => {
                setStep('amount');
                setPin('');
              }}
              variant="red"
            >
              <p>Back</p>
            </Button>
            <Button
              type="submit"
              disabled={pin.length < 4 || isWithdrawLoading}
            >
              <p>Confirm</p>
            </Button>
          </div>
        </form>
      )}

      {withdrawResult &&
        isWithdrawSucceed(withdrawResult.withdraw) &&
        step === 'succeed' && (
          <div className="flex w-full flex-col items-center gap-4">
            <div className="h-40">
              <DotLottiePlayer
                loop={true}
                autoplay={true}
                src="/assets/lotties/withdraw-success.lottie"
              />
            </div>
            <p className="text-3xl font-semibold">Summary</p>
            <div className="flex flex-row justify-between w-2/4 mt-8 text-xl">
              <p>
                <span className="font-bold">{`£5 `}</span>
                {`x ${withdrawResult.withdraw.fiveNotes} `}
              </p>
              <p>
                <span className="font-bold">{`£10 `}</span>
                {`x ${withdrawResult.withdraw.tenNotes} `}
              </p>
              <p>
                <span className="font-bold">{`£20 `}</span>
                {`x ${withdrawResult.withdraw.twentyNotes} `}
              </p>
            </div>
            <Button
              className="mt-8"
              type="button"
              onClick={() => closeWithdrawModal()}
              variant="green"
            >
              <p>Return to menu</p>
            </Button>
          </div>
        )}
    </Modal>
  );
};
