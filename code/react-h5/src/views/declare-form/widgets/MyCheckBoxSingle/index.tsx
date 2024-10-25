/**
 * 单选的checkbox，比如同意
 */
import { Checkbox } from 'antd-mobile';
import React from 'react';

export default function MyCheckBoxSingle(props: any) {
  const { schema, value, onChange } = props;

  return (
    <Checkbox checked={value} onChange={onChange}>
      {schema.title}
    </Checkbox>
  );
}
