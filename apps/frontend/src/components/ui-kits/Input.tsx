import classNames from 'classnames';
import { DetailedHTMLProps, InputHTMLAttributes, forwardRef } from 'react';

type IInput = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const Input = forwardRef<HTMLInputElement, IInput>((props, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      className={classNames(
        props.className,
        'h-10 sm:h-16 w-auto text-sm sm:text-xl',
        'flex rounded-xl sm:rounded-3xl text-center justify-center items-center',
        'focus-visible:ring-yellow-400 active:ring-yellow-400 focus:ring-yellow-400',
        'focus:outline-none focus:ring-2 shadow-lg cursor-default selection:bg-yellow-200',
      )}
    />
  );
});

Input.displayName = 'Input';
