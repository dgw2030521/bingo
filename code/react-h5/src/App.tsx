/**
 * 首页，不在router的context之中，所有hooks调用在BasicLayout中
 */
import { ConfigProvider, Toast } from 'antd-mobile';
import zhCN from 'antd-mobile/es/locales/zh-CN';
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import VConsole from 'vconsole';

import routes from './routes';
import { LoginProvider } from './store/user';
import { token_name } from './utils/constant';

Toast.config({ duration: 0 });

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

const router = createBrowserRouter(routes, {
  basename: import.meta.env.VITE_PUBLIC_PATH,
});

// 从本地加载之前的登录信息
const initUserInfo: Partial<any> = {
  Token: localStorage.getItem(token_name),
  TokenExpireTime: localStorage.getItem('tokenExpireTime'),
  TokenUpdateCode: localStorage.getItem('tokenUpdateCode'),
  ID: localStorage.getItem('ID'),
  Name: localStorage.getItem('Name'),
  UUKey: localStorage.getItem('UUKey'),
  LoginScriptValue: localStorage.getItem('LoginScriptValue'),
};

const App = () => {
  const vConsole = new VConsole();
  console.log(vConsole);

  return (
    <ConfigProvider locale={zhCN}>
      <LoginProvider initUserInfo={initUserInfo}>
        <RouterProvider router={router} />
      </LoginProvider>
    </ConfigProvider>
  );
};

export default App;
