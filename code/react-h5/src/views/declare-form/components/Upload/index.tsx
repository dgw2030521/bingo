import {
  Dialog,
  ImageUploader,
  ImageUploadItem,
  Space,
  Toast,
} from 'antd-mobile';
import { AddOutline } from 'antd-mobile-icons';
import classNames from 'classnames';
import update from 'immutability-helper';
import { findIndex, map } from 'lodash-es';
import React, { useEffect, useState } from 'react';

import useUploadImage from '@/views/declare-form/hooks/useUploadImage';

import styles from './index.module.scss';

interface UploadProps {
  value?: string;
  onChange?: (value: any) => void;
  memo: React.ReactNode;
  maxCount: number;
  fileSize: number;
  accept?: string;
}

type NewImageUploadItem = ImageUploadItem & { name: string; preUrl: string };

export default function Upload(props: UploadProps) {
  const { value, onChange, memo, maxCount, fileSize, accept } = props;

  const { handleImageUpload } = useUploadImage();

  const [fileList, setFileList] = useState<NewImageUploadItem[]>([]);

  useEffect(() => {
    // value=[]的时候，说明是新渲染，不需要处理
    if (value && typeof value === 'string') {
      const itemList = JSON.parse(value) as any[];
      const _fileList = map(itemList, item => {
        return convertToFile(item);
      });
      setFileList(_fileList);
    }
  }, [value]);

  /**
   * 将组件对象转为value
   * @param files
   */
  const convertUploadFileList = (files: NewImageUploadItem[]) => {
    return files.map(item => {
      const obj = {} as any;
      obj.Key = `${item.key}`;
      obj.Url = item.url;
      obj.Name = item.name;
      obj.PreUrl = item.preUrl;

      return obj;
    });
  };

  const convertToFile = (file: any): NewImageUploadItem => {
    return {
      url: file.Url,
      key: file.Key,
      name: file.Name,
      preUrl: file.PreUrl,
    };
  };

  function beforeUpload(file: File) {
    if (file.size > fileSize * (1024 * 1024)) {
      Toast.show(`请选择小于 ${fileSize}M 的图片`);
      return null;
    }
    return file;
  }

  const handleUpload = async (file: File) => {
    try {
      const result: any = await handleImageUpload(file);

      const newFileList = update(fileList, {
        $push: [
          {
            url: result.Url,
            key: result.Key,
            name: result.Name,
            preUrl: result.PreUrl,
          },
        ],
      });

      setFileList(newFileList);

      const newUploadFileList = convertUploadFileList(newFileList);
      onChange(JSON.stringify(newUploadFileList));

      return convertToFile(result);
    } catch (e) {
      Toast.show({
        content: '上传失败',
        duration: 2000,
        icon: 'fail',
      });
    }
  };

  return (
    <Space direction="vertical">
      <ImageUploader
        value={fileList}
        // capture={'camera'}
        accept={accept || 'image/*'}
        upload={handleUpload}
        beforeUpload={beforeUpload}
        multiple
        maxCount={maxCount}
        showUpload={fileList.length < maxCount}
        onDelete={(current: ImageUploadItem) => {
          return Dialog.confirm({
            content: '是否确认删除',
            onConfirm: async () => {
              const idx = findIndex(fileList, item => {
                return item.key === current.key;
              });
              const newFileList = update(fileList, {
                $splice: [[idx, 1]],
              });

              setFileList(newFileList);
              const newUploadFileList = convertUploadFileList(newFileList);

              onChange(JSON.stringify(newUploadFileList));
            },
          });
        }}
        onCountExceed={exceed => {
          Toast.show(`最多选择 ${maxCount} 张图片，你多选了 ${exceed} 张`);
        }}
      >
        <div
          className={styles.uploadBtn}
          style={{
            width: 80,
            height: 80,
            borderRadius: 4,
          }}
        >
          <AddOutline style={{ fontSize: 32 }} />
        </div>
      </ImageUploader>
      <div
        className={classNames({
          [styles.placeholder]: true,
        })}
      >
        {memo}
      </div>
    </Space>
  );
}
