import { Image, Space } from 'antd-mobile';
import { map } from 'lodash-es';
import React from 'react';

import Upload from '@/views/declare-form/components/Upload';

import styles from './index.module.scss';

export default function IOInvokerUpload(props: any) {
  const { value, onChange, schema, readOnly } = props;
  const { accept, fileSize, maxCount } = schema;

  if (readOnly) {
    if (value && typeof value === 'string') {
      const itemList = JSON.parse(value) as any[];
      return (
        <div className={styles.imagesContainer}>
          <Space wrap>
            {map(itemList, (item: any) => {
              return <Image className={styles.img} src={item.Url} />;
            })}
          </Space>
        </div>
      );
    }
  }

  return (
    <Upload
      accept={accept}
      value={value}
      onChange={onChange}
      memo={`请选择图片上传，图片大小最大不超过 ${fileSize}M，至多上传 ${maxCount} 张`}
      maxCount={maxCount}
      fileSize={fileSize}
    />
  );
}
