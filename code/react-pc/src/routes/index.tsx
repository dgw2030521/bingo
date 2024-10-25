import React from 'react';

import NotFound from '@/components/NotFound';
import BasicLayout from '@/layouts/BasicLayout';
import FlowDesign from '@/views/flow-design';
import FormDesign from '@/views/form-design';
import Home from '@/views/home';
import Login from '@/views/login';
import SliderDatepicker from '@/views/slider-datepicker';
import TreeConfig from '@/views/tree-config';

const routes = [
  {
    path: '/',
    handle: {
      title: 'pc模板 ',
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
        path: '/flow-design',
        handle: {
          title: '流程设计 ',
        },
        element: <FlowDesign />,
      },
      {
        path: '/form-design',
        handle: {
          title: '表单设计 ',
        },
        element: <FormDesign />,
      },
      {
        path: '/slider-datepicker',
        handle: {
          title: '横滑日期选择器 ',
        },
        element: <SliderDatepicker />,
      },
      {
        path: '/tree-config',
        handle: {
          title: '树插件 ',
        },
        element: <TreeConfig />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];
export default routes;
