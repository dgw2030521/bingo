import React from 'react';

import emptyImg from '@/assets/suggest/empty.png';

import s from './index.module.scss';

interface Prop {}

const Empty: React.FC<Prop> = props => {
  return (
    <div className={s.empty}>
      <img src={emptyImg} width={240} height={240} alt="" />
      <div>暂无数据</div>
    </div>
  );
};

export default Empty;
