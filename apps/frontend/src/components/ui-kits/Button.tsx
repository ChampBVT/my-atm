import classNames from 'classnames';
import { FC, ReactNode } from 'react';

interface IButton {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type: HTMLButtonElement['type'];
  className?: string;
  variant?: 'blue' | 'green' | 'red';
}

export const Button: FC<IButton> = ({
  children,
  disabled,
  onClick,
  type,
  className,
  variant = 'blue',
}) => {
  const getStyle = () => {
    switch (variant) {
      case 'green':
        return 'bg-green-500 text-white shadow-green-500/20 hover:shadow-green-500/40';
      case 'red':
        return 'bg-red-500 text-white shadow-red-500/20 hover:shadow-red-500/40';
      default:
        return 'bg-blue-500 text-white shadow-blue-500/20 hover:shadow-blue-500/40';
    }
  };

  return (
    <button
      className={classNames(
        className,
        'rounded-lg min-w-[8rem] py-3 px-6 font-sans text-md font-bold transition-all shadow-xl',
        'active:opacity-[0.85] active:shadow-none hover:shadow-lg',
        'focus:opacity-[0.85] focus:shadow-none',
        'disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none',
        getStyle(),
      )}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};
