import React from 'react';

import NotFound from '@/components/NotFound';
import BasicLayout from '@/layouts/BasicLayout';
import DeclareForm from '@/views/declare-form';
import Home from '@/views/home';

const routes = [
  {
    path: '/',
    handle: {
      title: 'h5模板 ',
    },
    element: <BasicLayout />,
    children: [
      {
        index: true,
        handle: {
          title: '首页 ',
        },
        element: <Home />,
      },
      {
        path: '/form',
        handle: {
          title: 'h5表单 ',
        },
        element: <DeclareForm />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];
export default routes;
