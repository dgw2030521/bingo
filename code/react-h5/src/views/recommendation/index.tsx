/**
 *【智能推荐】政策列表
 * QuestionaireInvoker.calculateResult
 * 重新计算
 * QuestionaireInvoker.calculate
 */
import { Empty } from 'antd-mobile';
import { isEmpty, map } from 'lodash-es';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import ImgIndexBg from '@/assets/recommendation/bgIcon.png';
import useRecomend from '@/views/recommendation/useRecomend';

import styles from './index.module.scss';

export default function Recommendation() {
  const navigate = useNavigate();
  const { calculateResult, getCalculateResult } = useRecomend();

  useEffect(() => {
    getCalculateResult();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img className={styles.imageBg} src={ImgIndexBg} />
        <div className={styles.title}>
          <span className={styles.desc}>预计可申报政策数：</span>
          <span className={styles.count}>{calculateResult?.Total}</span>
        </div>
        <div className={styles.memo}>
          平台根据您填写的问卷信息提供政策智能匹配服务，仅供参考，最终申报结果以政府审批公示为准。
        </div>
        <span
          className={styles.reCountBtn}
          onClick={() => {
            navigate(`/questions`);
          }}
        >
          {`${isEmpty(calculateResult?.PolicyList) ? '开始' : '重新'}`}计算
        </span>
      </div>
      <div className={styles.content}>
        <div className={styles.toolbar}>
          <div className={styles.left}>
            <span className={styles.item}>
              <span className={styles.icon} />
              <span className={styles.title}>推荐政策</span>
            </span>
          </div>
          <div className={styles.right} />
        </div>
        <div className={styles.list}>
          {isEmpty(calculateResult?.PolicyList) && (
            <Empty description="暂无数据" />
          )}
          {!isEmpty(calculateResult?.PolicyList) &&
            map(calculateResult?.PolicyList, (item, index) => (
              <div key={index}>policyItem</div>
            ))}
        </div>
      </div>
    </div>
  );
}
