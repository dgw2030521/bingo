import { QuestionaireInvoker } from '@CodeDefine/customer/Invoker/QuestionaireInvoker';
import { useEffect, useState } from 'react';
import { QuestionnaireRO } from '@CodeDefine/customer/QuestionnaireRO';
import { Toast } from 'antd-mobile';
import { QuestionnaireCalculateVO } from '@CodeDefine/customer/QuestionnaireCalculateVO';
import { each } from 'lodash-es';
import moment from 'moment';

export default function useQuestion() {
  const [loading, setLoading] = useState(false);
  const [questionsDetail, setQuestionsDetail] = useState<QuestionnaireRO>(null);
  const [formConfig, setFormConfig] = useState([]);

  // 企业全称和企业信用代码再查询匹配的时候得纯在
  const [searchCompanyName, setSearchCompanyName] = useState('');
  const [creditCode, setCreditCode] = useState('');

  /**
   * 查询企业信息
   * @param companyName
   */
  const getTYCCompanyInfo = async (companyName: string) => {
    setLoading(true);
    const { code, result } = await QuestionaireInvoker.getTYCCompanyInfo(
      companyName,
    );
    if (code.Code !== 200) {
      setLoading(false);
      return Promise.reject(code.Message);
    }
    setSearchCompanyName(companyName);
    setCreditCode(result.creditCode);
    setLoading(false);
    return Promise.resolve(result);
  };
  /**
   * 获取表单的填写数据和结构字段描述
   */
  const getOnlineDetail = async () => {
    setLoading(true);
    const { code, result } = await QuestionaireInvoker.getOnlineDetail();
    if (code.Code !== 200) {
      setLoading(false);
      return Promise.reject(code.Message);
    }
    setQuestionsDetail(result);
    const formConfig = JSON.parse(result.ClientJson || '[]');
    setFormConfig(formConfig);

    setLoading(false);
    return Promise.resolve(result);
  };

  /**
   * 组件内控制toast，这里就不需要设置loading状态
   * @param values
   */
  const handleCalcMatch = async (values: any) => {
    setLoading(true);
    const calculateVO: QuestionnaireCalculateVO[] = [];

    each(formConfig, _item => {
      each(_item.Item, item => {
        const param = new QuestionnaireCalculateVO();
        let value = values[item.Code];
        if (moment.isMoment(values[item.Code])) {
          value = moment(values[item.Code]).format('YYYY-MM-DD 00:00:00');
        }
        param.Key = item.Code;
        param.Value = value;
        calculateVO.push(param);
      });
    });

    const { code } = await QuestionaireInvoker.calculate(
      questionsDetail.ID,
      calculateVO,
      creditCode,
    );
    // 失败
    if (code.Code !== 200) {
      setLoading(false);
      throw new Error(code.Message);
    }
    setLoading(false);
    // 成功
    // navigate('list?' + new URLSearchParams(obj).toString());
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
    formConfig,
    questionsDetail,
    getOnlineDetail,
    getTYCCompanyInfo,
    creditCode,
    searchCompanyName,
    handleCalcMatch,
  };
}
