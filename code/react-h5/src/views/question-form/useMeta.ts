import { useEffect, useState } from 'react';
import { Toast } from 'antd-mobile';
import { MetaEnumInvoker } from '@CodeDefine/customer/Invoker/MetaEnumInvoker';
import { MetaEnumRO } from '@CodeDefine/customer/MetaEnumRO';
import {
  MetaDataTableInvokerEx,
  MetaDataTableInvokerParam,
} from '@CodeDefine/customer/Invoker/MetaDataTableInvoker';

export default function useMeta() {
  const [loading, setLoading] = useState(false);
  const [metaTreeData, setMetaTreeData] = useState([]);
  const [metaAll, setMeteAll] = useState(Array<MetaEnumRO>);

  const getMetaAll = async () => {
    setLoading(true);
    const { code, result } = await MetaEnumInvoker.displayAll();
    if (code.Code !== 200) {
      setLoading(false);
      return Promise.reject(code.Message);
    }
    setMeteAll(result);
    return Promise.resolve(result);
  };

  const getMetaData = async () => {
    setLoading(true);
    const queryData = new MetaDataTableInvokerParam.display();
    queryData.pageIdx = 1;
    queryData.pageSize = 999;
    queryData.condition.AsDefault._active = true;
    queryData.condition.AsDefault._value = 1;
    const { code, result } = await MetaDataTableInvokerEx.display(queryData);
    if (code.Code !== 200) {
      setLoading(false);
      return Promise.reject(code.Message);
    }
    setMetaTreeData(
      result?.Value.map(item => {
        return {
          ...item,
          title: item.Name,
          value: item.UUKey,
          key: item.UUKey,
          selectable: false,
          children: item?.FieldList?.map(i => {
            return {
              ...i,
              title: i.Name,
              key: `${item.UUKey}#${i.Code}`,
              value: `${item.UUKey}#${i.Code}`,
            };
          }),
        };
      }),
    );
    setLoading(false);
    return Promise.resolve(result);
  };

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
    getMetaAll,
    getMetaData,
    metaTreeData,
    metaAll,
  };
}
