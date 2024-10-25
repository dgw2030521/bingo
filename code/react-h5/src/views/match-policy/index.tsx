/**
 * 智能匹配结果
 */
import { Button, Modal, Popup } from 'antd-mobile';
import classNames from 'classnames';
import { isEmpty } from 'lodash-es';
import React, { useEffect, useState } from 'react';

import DeepMatch from '@/views/match-policy/deepMatch';
import MatchNumber from '@/views/match-policy/matchNumber';
import useMatchPolicy from '@/views/match-policy/useMatchPolicy';
import useMeta from '@/views/question-form/useMeta';

import styles from './index.module.scss';
import MatchResult from './matchResult';

interface MatchPolicyProps {
  policyId: string;
}
export default function MatchPolicy(props: MatchPolicyProps) {
  const [matchResultVisible, setMatchResultVisible] = useState(false);
  const [deepMatchVisible, setDeepMatchVisible] = useState(false);

  const {
    matchResult,
    getDeepMatchResult,
    getDeepMatchQuestionnaire,
    questionnaireDetail,
    handleDeepMatch,
    dataSource,
    setDataSource,
    setLoading,
  } = useMatchPolicy(props.policyId);

  const { metaAll, metaTreeData, getMetaAll, getMetaData } = useMeta();

  useEffect(() => {
    getDeepMatchResult();
    getDeepMatchQuestionnaire();
    getMetaAll();
    getMetaData();
  }, []);

  return (
    <div>
      <div className={styles.box}>
        <div className={styles.left}>
          <MatchNumber title="匹配结果" count={matchResult?.MatchRate} />
        </div>
        <div className={styles.right}>
          {!isEmpty(matchResult) && (
            <Button
              className={styles.operateBtn}
              onClick={() => {
                setMatchResultVisible(true);
              }}
            >
              匹配结果
            </Button>
          )}
          {!isEmpty(questionnaireDetail) && (
            <Button
              className={styles.operateBtn}
              onClick={async () => {
                setLoading(true);
                await getDeepMatchQuestionnaire();
                setLoading(false);
                setDeepMatchVisible(true);
              }}
            >
              深度匹配
            </Button>
          )}
        </div>
      </div>
      <Popup
        className={classNames({
          [styles.modal]: true,
          [styles.matchResult]: true,
        })}
        visible={matchResultVisible}
        bodyStyle={{
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
        }}
      >
        <MatchResult
          matchResult={matchResult}
          metaTreeData={metaTreeData}
          metaAll={metaAll}
          closeModalCallback={() => {
            setMatchResultVisible(false);
          }}
          reMatchCallback={async () => {
            setLoading(true);
            await getDeepMatchQuestionnaire();
            setLoading(false);
            setMatchResultVisible(false);
            setDeepMatchVisible(true);
          }}
        />
      </Popup>
      <Popup
        className={classNames({
          [styles.modal]: true,
          [styles.deepMatch]: true,
        })}
        visible={deepMatchVisible}
        bodyStyle={{
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
        }}
      >
        <DeepMatch
          dataSource={dataSource}
          setDataSource={setDataSource}
          metaAll={metaAll}
          metaTreeData={metaTreeData}
          questionnaireDetail={questionnaireDetail}
          closeModalCallback={() => {
            setDeepMatchVisible(false);
          }}
          onSubmitCallback={async (values: any) => {
            try {
              console.log(values);
              await handleDeepMatch(values);
              setDeepMatchVisible(false);
              setMatchResultVisible(true);
            } catch (e) {
              Modal.alert({
                content: e.message,
                closeOnMaskClick: true,
              });
            }
          }}
        />
      </Popup>
    </div>
  );
}
