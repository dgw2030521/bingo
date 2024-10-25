import React, { useRef } from 'react';
import { Input } from 'antd-mobile';
import styles from './index.module.scss';

export default function SearchInput() {
  const searchInputRef = useRef(null);
  return (
    <div className={styles.searchBox}>
      <span className={styles.fangdajing} />
      <Input
        className={styles.searchInput}
        ref={el => {
          searchInputRef.current = el;
        }}
        placeholder="请输入政策关键字"
      />
      <span
        className={styles.searchBtn}
        onClick={() => {
          // handleSearchBtnClick();
        }}
      >
        搜索
      </span>
    </div>
  );
}
