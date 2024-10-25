import React from 'react';
import { Input, InputProps, Picker } from 'antd-mobile';

interface Prop extends InputProps {
  options: any[];
  onPickChange?: (value: string, opt: any) => void;
  currentOption: any;
}

const InputPicker: React.FC<Prop> = props => {
  const { options = [], currentOption, ...restProps } = props;
  console.log('restProps: ', restProps.value, options);

  return (
    <div
      onClick={async () => {
        await Picker.prompt({
          columns: [options],
          defaultValue: [currentOption?.label],
          onConfirm(val) {
            props.onChange(`${val?.[0]}`);
            props.onPickChange(
              `${val?.[0]}`,
              options.find(item => item.value === val?.[0]),
            );
          },
        });
      }}
    >
      <Input placeholder="请输入" {...restProps} readOnly />
    </div>
  );
};

export default InputPicker;
