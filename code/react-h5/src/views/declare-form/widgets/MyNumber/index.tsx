import { Input, Space } from 'antd-mobile';
import React from 'react';

import styles from './index.module.scss';

export default function MyNumber(props: any) {
  const { schema, value, onChange, readOnly } = props;

  if (readOnly) {
    return <span>{`${value}(${schema.UnitName})`}</span>;
  }

  return (
    <Space className={styles.inputBox}>
      <Input
        style={{ '--text-align': 'right' }}
        type="number"
        className={styles.input}
        placeholder="请输入数字"
        defaultValue={value}
        onChange={onChange}
      />
      {schema.UnitName && (
        <span className={styles.icon}>{schema.UnitName}</span>
      )}
    </Space>
  );
}
