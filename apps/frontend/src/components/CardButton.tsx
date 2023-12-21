import { DotLottiePlayer } from '@dotlottie/react-player';
import classNames from 'classnames';
import { ComponentProps, FC } from 'react';

interface ICardButton {
  lottie: ComponentProps<typeof DotLottiePlayer>;
  label: string;
  labelClassName?: string;
  buttonClassName?: string;
  onClick?: () => void;
}

export const CardButton: FC<ICardButton> = ({
  lottie,
  labelClassName,
  buttonClassName,
  label,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={classNames(
        'flex flex-col justify-around items-center rounded-2xl p-4 gap-4',
        'transition hover:scale-110 active:opacity-70',
        buttonClassName,
      )}
    >
      <div className="w-auto h-32">
        <DotLottiePlayer {...lottie} loop={true} autoplay={true} />
      </div>
      <p className={classNames('font-bold text-xl', labelClassName)}>{label}</p>
    </button>
  );
};
