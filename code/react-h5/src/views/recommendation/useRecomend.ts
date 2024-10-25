import { Toast } from 'antd-mobile';
import { CalculateResultConditionVO } from '@CodeDefine/customer/CalculateResultConditionVO';
import { CalculateResultQueryType } from '@CodeDefine/customer/CalculateResultQueryType';
import { QuestionaireInvoker } from '@CodeDefine/customer/Invoker/QuestionaireInvoker';
import { useEffect, useState } from 'react';
import { CalculateResultRO } from '@CodeDefine/customer/CalculateResultRO';
import { ViEnum32 } from '../../../ViCross/ViEnum32';

export default function useRecomend() {
  const [loading, setLoading] = useState(false);
  const [calculateResult, setCalculateResult] =
    useState<CalculateResultRO>(null);

  /**
   * 查询计算结果
   * creditCode 传空获取的是当前登陆企业的CreditCode
   * queryType 移动端固定传1
   * SearchKey 不需要
   */
  const getCalculateResult = async (): Promise<CalculateResultRO> => {
    const condition = new CalculateResultConditionVO();
    // 传空
    condition.SearchKey = '';
    // 固定
    const queryType = new ViEnum32<CalculateResultQueryType>(
      CalculateResultQueryType.CAN.Value,
    );
    condition.QueryType = queryType;
    setLoading(true);

    const { code, result } = await QuestionaireInvoker.calculateResult(
      condition,
      '',
    );
    if (code.Code !== 200) {
      setLoading(false);
      return Promise.reject(code.Message);
    }
    setCalculateResult(result);
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

  return { calculateResult, getCalculateResult };
}
