import React from 'react';
import { Checkbox, Space } from 'antd-mobile';
import { map, omit } from 'lodash-es';

export default function MyCheckBoxMultiple(props: any) {
  const { value, onChange, options } = omit(props, ['addons', 'schema']);

  return (
    <Checkbox.Group value={value} onChange={onChange}>
      <Space direction="vertical">
        {map(options, item => {
          return (
            <Checkbox key={item.value} value={item.value}>
              {item.label}
            </Checkbox>
          );
        })}
      </Space>
    </Checkbox.Group>
  );
}
