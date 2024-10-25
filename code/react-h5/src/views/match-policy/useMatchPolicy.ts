import { PolicyRuleMatchInvoker } from '@CodeDefine/customer/Invoker/PolicyRuleMatchInvoker';
import { useEffect, useState } from 'react';
import { PolicyRuleMatchDetailRO } from '@CodeDefine/customer/PolicyRuleMatchDetailRO';
import { PolicyRuleQuestionnaireRO } from '@CodeDefine/customer/PolicyRuleQuestionnaireRO';
import { PolicyMetaValuateTO } from '@CodeDefine/customer/PolicyMetaValuateTO';
import { PolicyFieldValuateNodeTO } from '@CodeDefine/customer/PolicyFieldValuateNodeTO';
import { Toast } from 'antd-mobile';

/**
 * 当前匹配度、表单
 * PolicyRuleMatchInvoker.getDeepMatchQuestionnaire
 *
 * 表单标题
 * MetaDataTableInvoker.display
 *
 * 点匹配匹配
 * PolicyRuleMatchInvoker.deepMatch
 *
 * 匹配结果
 * PolicyRuleMatchInvoker.getDeepMatchResult
 *
 */
export default function useMatchPolicy(policyId: string) {
  const [loading, setLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<PolicyRuleMatchDetailRO>(null);
  const [questionnaireDetail, setQuestionnaireDetail] =
    useState<PolicyRuleQuestionnaireRO>(null);

  // 深度表单配置
  const [dataSource, setDataSource] =
    useState<PolicyFieldValuateNodeTO[]>(null);

  /**
   * 获取匹配结果，包含真实填写的数据
   */
  const getDeepMatchResult = async () => {
    const { code, result } = await PolicyRuleMatchInvoker.getDeepMatchResult(
      policyId,
      '',
    );
    if (code.Code !== 200) {
      throw new Error(code.Message);
    }
    setMatchResult(result);
    return result;
  };

  /**
   * 获得深度匹配页的结果和表单项
   */
  const getDeepMatchQuestionnaire = async () => {
    const { result, code } =
      await PolicyRuleMatchInvoker.getDeepMatchQuestionnaire(policyId, '');
    if (code.Code !== 200) {
      throw new Error(code.Message);
    }

    console.log('@@@result', result);
    setQuestionnaireDetail(result);
    // 包含问卷表单的初始值
    setDataSource(result?.QuestionnaireDetail?.FieldEvaluateList);
    return result;
  };

  /**
   * 调用深度匹配计算
   * @param values
   */
  const handleDeepMatch = async (values: any) => {
    setLoading(true);
    const matchVO = new PolicyMetaValuateTO();
    // result?.QuestionnaireDetail?.FieldEvaluateList
    matchVO.FieldEvaluateList = dataSource;
    const { code, result } = await PolicyRuleMatchInvoker.deepMatch(
      policyId,
      matchVO,
      '',
    );
    if (code.Code !== 200) {
      setLoading(false);
      throw new Error(code.Message);
    }
    // 重新获取匹配结果
    await getDeepMatchResult();
    setLoading(false);
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
    matchResult,
    getDeepMatchResult,
    getDeepMatchQuestionnaire,
    questionnaireDetail,
    handleDeepMatch,
    setDataSource,
    dataSource,
    setLoading,
    loading,
  };
}
