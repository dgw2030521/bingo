import { Button, Space } from 'antd';
import React from 'react';

import { request } from '@/utils/request';

interface IProps {
  list: any[];
  pageNum: number;
  pageSize: number;
  total: number;
  totalPage: number;
}

export default function Home() {
  const getData = async () => {
    try {
      const result = await request.post<IProps>('/area/page', {
        pageNum: 1,
        pageSize: 3,
      });

      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };
  const getData1 = async () => {
    try {
      const result = await request.post<IProps>('/area/page1', {
        pageNum: 1,
        pageSize: 3,
      });

      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <Space style={{ width: '100%', padding: 50 }}>
        <Button
          onClick={() => {
            getData();
          }}
        >
          正常请求
        </Button>
        <Button
          onClick={() => {
            getData();
            getData();
            getData();
            getData();
            getData();
            getData();
            getData();
            getData();
          }}
        >
          取消重复请求(连发8个，取消7个)
        </Button>
        <Button
          onClick={() => {
            getData1();
          }}
        >
          请求重试
        </Button>
      </Space>
      <div>1122</div>
    </div>
  );
}
