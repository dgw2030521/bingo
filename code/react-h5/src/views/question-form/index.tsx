import { Button, Empty, Form, Input, Modal, Toast } from 'antd-mobile';
import { isEmpty } from 'lodash-es';
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import RenderForm from '@/components/RenderForm';
import { useLoginContext } from '@/store/user';
import { transformCodeName } from '@/utils/constant';
import useMeta from '@/views/question-form/useMeta';
import useQuestion from '@/views/question-form/useQuestion';

import styles from './index.module.scss';

export default function QuestionForm() {
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const {
    questionsDetail,
    getOnlineDetail,
    getTYCCompanyInfo,
    formConfig,
    handleCalcMatch,
    searchCompanyName,
    creditCode,
  } = useQuestion();
  const { metaAll, metaTreeData, getMetaAll, getMetaData } = useMeta();
  const [form] = Form.useForm();

  const { user } = useLoginContext();
  const loginInfo = JSON.parse(user?.LoginScriptValue || '{}');
  console.log('loginInfo: ', loginInfo);
  const handleSearchBtnClick = async () => {
    const fullName = searchInputRef.current.nativeElement.value;
    if (!fullName) {
      Modal.alert({
        content: '请输入企业全称',
        closeOnMaskClick: true,
      });
      return;
    }
    try {
      const result = await getTYCCompanyInfo(fullName);
      form.setFieldsValue(transformCodeName(result));
    } catch (e) {
      console.log(e);
    }
  };

  const doCalcMatch = async values => {
    try {
      await handleCalcMatch(values);

      const obj = {
        searchCompanyName,
        creditCode,
      };
      navigate(`/recommendation?${new URLSearchParams(obj).toString()}`);
    } catch (e) {
      Toast.show({
        content: '匹配计算失败',
        duration: 2000,
        icon: 'fail',
      });
    }
  };

  useEffect(() => {
    // 同时发起请求
    Promise.all([getOnlineDetail(), getMetaAll(), getMetaData()]);
  }, []);

  if (isEmpty(formConfig)) return <Empty description="功能维护升级中！" />;
  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <div className={styles.searchBox}>
          <span className={styles.fangdajing} />
          <Input
            className={styles.searchInput}
            ref={el => {
              searchInputRef.current = el;
            }}
            defaultValue={loginInfo?.CompanyName}
            placeholder="请输入企业全称"
          />
          <span
            className={styles.searchBtn}
            onClick={() => {
              handleSearchBtnClick();
            }}
          >
            获取数据
          </span>
        </div>
      </div>
      <div className={styles.content}>
        <RenderForm
          formConfig={formConfig}
          form={form}
          questionDetail={questionsDetail}
          metaAll={metaAll}
          metaTreeData={metaTreeData}
          onSubmit={(values: any) => {
            doCalcMatch(values);
          }}
        />
        <div className={styles.footer}>
          <Button
            color="primary"
            fill="outline"
            className={styles.cancel}
            onClick={() => {
              navigate('/recommendation');
            }}
          >
            取消
          </Button>
          <Button
            color="primary"
            fill="solid"
            className={styles.calc}
            onClick={() => {
              form.submit();
            }}
          >
            开始计算
          </Button>
        </div>
      </div>
    </div>
  );
}
