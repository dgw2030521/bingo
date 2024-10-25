/**
 * 基础布局，所有页面入口
 */
import { last } from 'lodash-es';
import React, { Suspense } from 'react';
import Helmet from 'react-helmet';
import { Outlet, useMatches } from 'react-router-dom';

export default function BasicLayout() {
  const matches = useMatches();
  const filterInvalidMatches = matches?.filter(i => Boolean(i.handle));
  const lastMatch: any = last(filterInvalidMatches);

  // 判断是否有登录信息，没有登录信息，默认进行游客登录

  return (
    <Suspense fallback={<div>loading...</div>}>
      <Helmet>
        <title>{lastMatch?.handle?.title}</title>
      </Helmet>
      <Outlet />
    </Suspense>
  );
}
