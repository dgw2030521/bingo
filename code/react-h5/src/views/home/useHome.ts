import { Toast } from 'antd-mobile';
import { useEffect, useState } from 'react';

const PAGE_SIZE = 10;

export default function useHome() {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const getHomePolicyStat = async () => {};

  // @NOTICE  放在页面里
  useEffect(() => {
    if (loading) {
      Toast.show({
        icon: 'loading',
        content: '加载中...',
      });
    } else {
      Toast.clear();
    }
  }, [loading]);

  return {
    currentPage,
    getHomePolicyStat,
  };
}
