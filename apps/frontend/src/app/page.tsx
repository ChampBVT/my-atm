'use client';
import { useContext, useEffect, useRef, useState } from 'react';
import { WelcomeModal } from '@/components/WelcomeModal';
import { useInquiryAccount } from '@/hooks/useInquiryAccount';
import { useModal } from '@/hooks/useModal';
import { AccountContext } from '@/contexts/AccountContext';
import {
  DotLottiePlayer,
  DotLottieCommonPlayer,
} from '@dotlottie/react-player';
import classNames from 'classnames';
import { CardButton } from '@/components/CardButton';
import { WithdrawModal } from '@/components/WithdrawModal';

export default function Home() {
  const accountContext = useContext(AccountContext);
  const [pin, setPin] = useState('');
  const statsAnimationRef = useRef<DotLottieCommonPlayer>(null);

  const { fetchInquiryAccount, isInquiryAccountLoading } = useInquiryAccount();

  const {
    isOpen: isWelcomeModalOpen,
    openModal: openWelcomeModal,
    closeModal: closeWelcomeModal,
  } = useModal(!accountContext.account);

  const {
    isOpen: isWithdrawModalOpen,
    openModal: openWithdrawModal,
    closeModal: closeWithdrawModal,
  } = useModal();

  useEffect(() => {
    if (accountContext.account) {
      closeWelcomeModal();
      statsAnimationRef.current?.goToAndPlay(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountContext.account, statsAnimationRef.current]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-around p-24">
      <div
        className={classNames(
          'transition-all max-w-3xl w-full flex justify-center flex-col items-center gap-10',
          {
            'opacity-0': !accountContext.account,
            'opacity-100': !!accountContext.account,
          },
        )}
      >
        <div className="w-[600px]">
          <DotLottiePlayer
            ref={statsAnimationRef}
            src="/assets/lotties/stats.lottie"
            loop={false}
            autoplay={false}
          />
        </div>
        <h1 className="text-4xl font-bold">Welcome back!</h1>
        <p className="text-3xl font-semibold">
          Balance: £
          {accountContext.account?.balance.toLocaleString('en-US') ?? 0}
        </p>

        <div className="grid grid-cols-2 grid-rows-2 gap-20">
          <CardButton
            lottie={{
              src: '/assets/lotties/withdraw.lottie',
              speed: 0.7,
              className: '-mt-4',
            }}
            buttonClassName="bg-yellow-300"
            label="Withdraw"
            onClick={() => openWithdrawModal()}
          />
          <CardButton
            lottie={{
              src: '/assets/lotties/github.lottie',
              className: 'rounded-full bg-white',
            }}
            onClick={() => window.open('https://github.com', '_blank')}
            buttonClassName="bg-black"
            label="Github"
            labelClassName="text-white"
          />
          <CardButton
            lottie={{
              src: '/assets/lotties/testing.lottie',
              className: '!h-40 -mt-2',
            }}
            onClick={() => window.open('https://github.com', '_blank')}
            buttonClassName="bg-lime-300"
            label="Testings"
            labelClassName="text-black"
          />
          <CardButton
            lottie={{
              src: '/assets/lotties/graphql.lottie',
              className: 'mt-4',
            }}
            onClick={() =>
              window.open(process.env.NEXT_PUBLIC_API_URL, '_blank')
            }
            buttonClassName="bg-violet-500"
            label="GQL Playground"
            labelClassName="text-white"
          />
        </div>
      </div>
      <WelcomeModal
        title="Welcome!"
        inputValue={pin}
        inputOnChange={setPin}
        onClickButton={() => {
          fetchInquiryAccount({ variables: { pin } });
          setPin('');
        }}
        buttonLabel="Continue"
        isLoading={isInquiryAccountLoading}
        isOpen={isWelcomeModalOpen}
        openModal={openWelcomeModal}
        closeModal={closeWelcomeModal}
        preventOutsideClick={true}
      />
      <WithdrawModal
        refetchInquiryAccount={(pin) =>
          fetchInquiryAccount(
            {
              variables: { pin },
            },
            false,
          )
        }
        isOpen={isWithdrawModalOpen}
        openModal={openWithdrawModal}
        closeModal={closeWithdrawModal}
      />
    </main>
  );
}
