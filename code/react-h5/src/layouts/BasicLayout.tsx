/**
 * 基础布局，所有页面入口
 */
import { last } from 'lodash-es';
import React, { Suspense } from 'react';
import Helmet from 'react-helmet';
import { Outlet, useMatches } from 'react-router-dom';

import servicerIcon from '@/assets/common/servicer.png';
import { servicer_robot_url } from '@/utils/constant';

import styles from './index.module.scss';

export default function BasicLayout() {
  const matches = useMatches();
  const filterInvalidMatches = matches?.filter(i => Boolean(i.handle));
  const lastMatch: any = last(filterInvalidMatches);

  // 判断是否有登录信息，没有登录信息，默认进行游客登录

  return (
    <Suspense fallback={<div>loading...</div>}>
      {/* <NavBar
          onBack={back}
          style={{ marginBottom: '10px', backgroundColor: '#fff' }}>
          标题
        </NavBar> */}
      <Helmet>
        <title>{lastMatch?.handle?.title}</title>
      </Helmet>
      <Outlet />

      <img
        className={styles.servicerIcon}
        src={servicerIcon}
        onClick={() => {
          window.open(servicer_robot_url);
        }}
      />
    </Suspense>
  );
}
