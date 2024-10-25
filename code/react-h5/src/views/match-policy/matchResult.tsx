import { FieldConditionOperateType } from '@CodeDefine/customer/FieldConditionOperateType';
import { MetaEnumRO } from '@CodeDefine/customer/MetaEnumRO';
import { MetaValueType } from '@CodeDefine/customer/MetaValueType';
import { PolicyFieldConditionTO } from '@CodeDefine/customer/PolicyFieldConditionTO';
import { PolicyFieldConditionTreeTO } from '@CodeDefine/customer/PolicyFieldConditionTreeTO';
import { PolicyFieldValuateNodeTO } from '@CodeDefine/customer/PolicyFieldValuateNodeTO';
import { PolicyRuleMatchDetailRO } from '@CodeDefine/customer/PolicyRuleMatchDetailRO';
import { Button } from 'antd-mobile';
import classNames from 'classnames';
import { isEmpty, map } from 'lodash-es';
import React from 'react';

import styles from '@/views/match-policy/index.module.scss';
import MatchNumber from '@/views/match-policy/matchNumber';

interface ModalProps {
  closeModalCallback: () => void;
  matchResult: PolicyRuleMatchDetailRO;
  reMatchCallback: () => void;
  metaAll: MetaEnumRO[];
  metaTreeData: any[];
}
export default function MatchResult(props: ModalProps) {
  const {
    closeModalCallback,
    matchResult,
    reMatchCallback,
    metaAll,
    metaTreeData,
  } = props;

  const returnString = (json, memberList) => {
    const value = JSON.parse(json || null) || [];
    let text = '';
    value.map(item => {
      text += `${memberList?.find(res => res.value === item).label} `;
    });

    return text;
  };

  const renderContentList = (
    ContentList: PolicyFieldConditionTO[],
    parentPath: string,
    rootIndex?: number,
  ) => {
    return (
      <div className={styles.conditionItem} key={parentPath}>
        {map(ContentList, (item, idx) => {
          const currentPath = `${parentPath}|${idx}`;
          const record = metaTreeData
            ?.find(res => res.UUKey === item.Table)
            ?.FieldList?.find(res => res.Code === item.Field);
          const valueType = record?.ValueType?._value || 0;
          const isArrayValue =
            item.Operate._value === FieldConditionOperateType.In.Value ||
            item.Operate._value === FieldConditionOperateType.NotIn.Value;
          const memberList =
            valueType === MetaValueType.Bool.Value
              ? [
                  { value: 1, label: '是' },
                  { value: 0, label: '否' },
                ]
              : metaAll
                  .find(rst => rst.UUKey === record?.ValueGenericType)
                  ?.MemberList.map((info: any) => {
                    return {
                      key: info.Value,
                      value: info.Value,
                      label: info.Desc,
                    };
                  });

          console.log('---renderConditions--currentPath', currentPath);

          return (
            <div className={styles.matchedBox} key={currentPath}>
              <div className={styles.matchedItem}>
                <div className={styles.title}>
                  <span
                    className={classNames({
                      [styles.flag]: true,
                      [styles.matched]: item.MatchRet,
                      [styles.notMatched]: !item.MatchRet,
                    })}
                  />
                  <span className={styles.ruleName}>{record.Name}</span>
                </div>
                <span
                  className={classNames({
                    [styles.matchDesc]: true,
                    [styles.matched]: item?.MatchRet,
                    [styles.notMatched]: !item?.MatchRet,
                  })}
                >
                  {item?.MatchRet ? '匹配' : '不匹配'}
                </span>
              </div>
              <div
                className={classNames({
                  [styles.notMatchedReason]: true,
                  [styles.hidden]: item?.MatchRet,
                })}
              >
                <span className={styles.rTitle}>企业当前情况：</span>
                <span className={styles.rValue}>
                  {valueType !== MetaValueType.Bool.Value &&
                  valueType !== MetaValueType.Enum.Value
                    ? item.ValueSelected
                    : memberList?.find(
                        res =>
                          res.value ===
                          JSON.parse(
                            item.ValueSelected === ''
                              ? null
                              : item.ValueSelected ?? null,
                          ),
                      )?.label}
                </span>
                <span>、</span>
                <span className={styles.rTitle}>指标要求：</span>
                <span className={styles.rValue}>
                  {
                    FieldConditionOperateType.ValueList?.find(
                      res => res.Value === item.Operate._value,
                    )?.Desc
                  }
                  &nbsp;
                  {valueType !== MetaValueType.Bool.Value &&
                  valueType !== MetaValueType.Enum.Value
                    ? item.Value
                    : isArrayValue
                    ? returnString(item.Value, memberList)
                    : memberList?.find(
                        res =>
                          res.value ===
                          JSON.parse(
                            item.Value === '' ? null : item.Value ?? null,
                          ),
                      )?.label}
                </span>
              </div>
            </div>
          );

          // return (
          //   <div className={styles['single-result']} key={currentPath}>
          //     <p className="title">{record.Name}</p>
          //     <div className="content">
          //       <span
          //         className="match"
          //         style={{
          //           background: item.MatchRet ? '#2FC87D' : '#FF6464',
          //         }}
          //       >
          //         {item?.MatchRet ? '匹配' : '不匹配'}
          //       </span>
          //       <p>
          //         企业当前情况:
          //         {valueType !== MetaValueType.Bool.Value &&
          //         valueType !== MetaValueType.Enum.Value
          //           ? item.ValueSelected
          //           : memberList?.find(
          //               res =>
          //                 res.value ===
          //                 JSON.parse(
          //                   item.ValueSelected === ''
          //                     ? null
          //                     : item.ValueSelected ?? null,
          //                 ),
          //             )?.label}
          //       </p>
          //       <p>
          //         指标要求:
          //         {
          //           FieldConditionOperateType.ValueList?.find(
          //             res => res.Value === item.Operate._value,
          //           )?.Desc
          //         }
          //         &nbsp;
          //         {valueType !== MetaValueType.Bool.Value &&
          //         valueType !== MetaValueType.Enum.Value
          //           ? item.Value
          //           : isArrayValue
          //           ? returnString(item.Value, memberList)
          //           : memberList?.find(
          //               res =>
          //                 res.value ===
          //                 JSON.parse(
          //                   item.Value === '' ? null : item.Value ?? null,
          //                 ),
          //             )?.label}
          //       </p>
          //     </div>
          //   </div>
          // );
        })}
      </div>
    );
  };

  const renderNode = (
    node: PolicyFieldConditionTreeTO,
    prePath: string,
    preIndex: number,
    nodeIndex: number,
  ) => {
    if (isEmpty(node)) return null;
    const currentPath = `${prePath}|${preIndex}|${nodeIndex}`;
    console.log('=====currentPath', currentPath);
    // 根节点就不需要再次渲染且或
    return (
      <section className={styles['rules-group']} key={currentPath}>
        {/* {prePath !== '-' && ( */}
        {/*  <div className="LinkType"> */}
        {/*    <div className="switch"> */}
        {/*      <p>{node?.LinkType?._value === 0 ? '且' : '或'}</p> */}
        {/*      <span className="line" /> */}
        {/*    </div> */}
        {/*  </div> */}
        {/* )} */}
        {renderContentList(
          node?.ContentList,
          `${currentPath}|ContentList`,
          preIndex,
        )}
        {renderConditions(
          node?.ChildList,
          `${currentPath}|ChildList`,
          nodeIndex,
        )}
      </section>
    );
  };

  const renderConditions = (
    nodes: PolicyFieldConditionTreeTO[],
    parentPath: string,
    parentIndex: number,
  ) => {
    return map(nodes, (item, nodeIndex) => {
      if (item.ContentList?.length < 1 && parentPath !== '-') return null;
      return renderNode(item, parentPath, parentIndex, nodeIndex);
    });
  };

  const renderFieldEvaluateList = (
    fieldEvaluateList: PolicyFieldValuateNodeTO[],
  ) => {
    return map(
      fieldEvaluateList,
      (item: PolicyFieldValuateNodeTO, fieldIndex: number) => {
        return renderConditions([item.Condition], '-', fieldIndex);
      },
    );
  };

  return (
    <div className={styles.box}>
      <div className={styles.header}>
        <span className={styles.title}>匹配结果</span>
        <span
          className={styles.close}
          onClick={() => {
            closeModalCallback();
          }}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.body}>
          <div className={styles.head}>
            <MatchNumber count={matchResult?.MatchRate} />
          </div>
          <div className={styles.list}>
            {/* <div className="LinkType"> */}
            {/*  <div className="switch"> */}
            {/*    <p style={{ marginTop: '30px' }}> 且</p> */}
            {/*    <span className="line" style={{ top: '-40px' }} /> */}
            {/*  </div> */}
            {/* </div> */}

            {renderFieldEvaluateList(
              matchResult?.MatchDetail?.FieldEvaluateList,
            )}
          </div>
        </div>
        <div className={styles.footer}>
          <Button
            className={classNames({
              [styles.contentBtn]: true,
              [styles.primary]: true,
            })}
            onClick={() => {
              reMatchCallback();
            }}
          >
            重新匹配
          </Button>
        </div>
      </div>
    </div>
  );
}
