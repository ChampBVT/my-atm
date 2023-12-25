import { Input } from '@/components/ui-kits/Input';
import classNames from 'classnames';
import { FC } from 'react';
import OtpInput from 'react-otp-input';

interface IInputPin {
  value: string;
  onChange: (_value: string) => void;
  numInputs?: number;
}

export const InputPin: FC<IInputPin> = ({ value, onChange, numInputs = 4 }) => {
  return (
    <div className="flex flex-col items-center">
      <h4 className="text-xl sm:text-3xl font-bold">Enter your PIN</h4>
      <OtpInput
        value={value}
        onChange={onChange}
        numInputs={numInputs}
        inputType="password"
        renderSeparator={() => <span className="w-4" />}
        renderInput={(props) => (
          <Input
            {...props}
            autoComplete="off"
            role="presentation"
            className={classNames(
              props.className,
              '!w-10 !h-10 sm:!w-40 sm:!h-40 !text-3xl sm:!text-10xl pb-1 sm:pb-6 select-none caret-transparent selection:!bg-transparent',
            )}
          />
        )}
        containerStyle="pt-10"
        shouldAutoFocus
        skipDefaultStyles
      />
    </div>
  );
};
