import { DownOutline, UpOutline } from 'antd-mobile-icons';
import classNames from 'classnames';
import React, { useState } from 'react';

import styles from '@/views/declare-form/index.module.scss';

interface FormBoxProps {
  title: string;
  expand?: boolean;
  children: React.ReactNode;
  // 隐藏展开按钮，按钮隐藏时候，expand默认为true切不可改变
  hideExpandBtn?: boolean;
}

export default function FormBox(props: FormBoxProps) {
  const { hideExpandBtn } = props;
  let defaultExpand = !!props.expand;
  if (hideExpandBtn) {
    defaultExpand = true;
  }
  const [expand, setExpand] = useState<boolean>(defaultExpand);
  return (
    <div
      className={classNames({
        [styles.card]: true,
        [styles.close]: !expand,
      })}
    >
      <div
        className={styles.head}
        onClick={() => {
          if (hideExpandBtn) {
            return;
          }
          setExpand(!expand);
        }}
      >
        <div className={styles.left}>{props.title}</div>
        <div className={styles.right}>
          {!hideExpandBtn && (
            <span className={styles.btn}>
              {expand ? '收起' : '展开'}
              {expand ? <UpOutline /> : <DownOutline />}
            </span>
          )}
        </div>
      </div>
      <div
        className={classNames({
          [styles.body]: true,
        })}
      >
        {props.children}
      </div>
    </div>
  );
}
