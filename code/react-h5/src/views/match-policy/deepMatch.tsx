import { FieldConditionOperateType } from '@CodeDefine/customer/FieldConditionOperateType';
import { MetaEnumRO } from '@CodeDefine/customer/MetaEnumRO';
import { MetaValueType } from '@CodeDefine/customer/MetaValueType';
import { PolicyFieldConditionTO } from '@CodeDefine/customer/PolicyFieldConditionTO';
import { PolicyFieldConditionTreeTO } from '@CodeDefine/customer/PolicyFieldConditionTreeTO';
import { PolicyFieldValuateNodeTO } from '@CodeDefine/customer/PolicyFieldValuateNodeTO';
import { PolicyRuleQuestionnaireRO } from '@CodeDefine/customer/PolicyRuleQuestionnaireRO';
import {
  Button,
  DatePicker,
  DatePickerRef,
  Form,
  Input,
  Radio,
  Selector,
  Space,
} from 'antd-mobile';
import classNames from 'classnames';
import { setProperty } from 'dot-prop';
import update from 'immutability-helper';
import { isEmpty, map } from 'lodash-es';
import moment from 'moment';
import React, { Fragment, RefObject, useEffect } from 'react';

import styles from '@/views/match-policy/index.module.scss';
import MatchNumber from '@/views/match-policy/matchNumber';
import {
  getOperationPath,
  transformFormData,
} from '@/views/match-policy/utils';

interface ModalProps {
  onSubmitCallback: (values: any) => void;
  closeModalCallback: () => void;
  metaAll: MetaEnumRO[];
  metaTreeData: any[];
  questionnaireDetail: PolicyRuleQuestionnaireRO;
  dataSource: PolicyFieldValuateNodeTO[];
  setDataSource: (data: PolicyFieldValuateNodeTO[]) => void;
}

export default function DeepMatch(props: ModalProps) {
  const {
    onSubmitCallback,
    closeModalCallback,
    metaAll,
    metaTreeData,
    questionnaireDetail,
    dataSource,
    setDataSource,
  } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(
      transformFormData(
        questionnaireDetail?.QuestionnaireDetail?.FieldEvaluateList,
        metaTreeData,
        metaAll,
      ),
    );
  }, []);

  const renderErrors = (errorFields: any) => {
    return errorFields.map((item: any) => {
      return (
        <div key={item.name} className={styles.errorItem}>
          {item.errors[0]}
        </div>
      );
    });
  };

  const handleFieldChange = async (
    nodePath: string,
    value: any,
    index: number,
  ) => {
    const operPath = getOperationPath(nodePath);

    const operatesDesc = setProperty(
      {},
      `${operPath === '' ? '' : `${operPath}.ValueSelected`}.$set`,
      value,
    );

    const newData = update(dataSource[index]?.Condition, operatesDesc[0]);

    dataSource[index].Condition = newData;
    setDataSource([...dataSource]);
  };

  const renderContentList = (
    ContentList: PolicyFieldConditionTO[],
    parentPath: string,
    rootIndex: number,
  ) => {
    return (
      <div className="conditionItem" key={parentPath}>
        {map(ContentList, (item, idx) => {
          const currentPath = `${parentPath}|${idx}`;

          const record = metaTreeData
            ?.find(res => res.UUKey === item.Table)
            ?.FieldList?.find(res => res.Code === item.Field);
          const valueType = record?.ValueType?._value || 0;

          const options =
            valueType === MetaValueType.Bool.Value
              ? [
                  { value: '1', label: '是' },
                  { value: '0', label: '否' },
                ]
              : metaAll
                  .find(rst => rst.UUKey === record?.ValueGenericType)
                  ?.MemberList.map((info: any) => {
                    return {
                      value: info.Value,
                      key: info.Value,
                      label: info.Desc,
                    };
                  });

          return (
            <Fragment key={currentPath}>
              {(valueType === MetaValueType.Text.Value ||
                valueType === MetaValueType.Int.Value ||
                valueType === MetaValueType.Long.Value ||
                valueType === MetaValueType.String.Value ||
                valueType === MetaValueType.Double.Value) &&
                !item.IsRepeat && (
                  <Form.Item
                    label={`${record?.Name}`}
                    name={`${item.Table}#${item.Field}`}
                    // className={styles.item}
                    rules={[
                      { required: true, message: `请输入${record?.Name}` },
                    ]}
                  >
                    <Input
                      placeholder={`请输入${record?.Name}`}
                      onChange={value => {
                        const _value =
                          item?.Operate?._value ===
                            FieldConditionOperateType.In.Value ||
                          item?.Operate?._value ===
                            FieldConditionOperateType.NotIn.Value
                            ? JSON.stringify(value.split(','))
                            : value;
                        handleFieldChange(currentPath, _value, rootIndex);
                      }}
                    />
                  </Form.Item>
                )}

              {valueType === MetaValueType.Bool.Value && !item.IsRepeat && (
                <Form.Item
                  label={`${record?.Name}`}
                  name={`${item.Table}#${item.Field}`}
                  // className={styles.item}
                  rules={[{ required: true, message: `请选择${record?.Name}` }]}
                >
                  <Radio.Group
                    onChange={value => {
                      handleFieldChange(currentPath, value, rootIndex);
                    }}
                  >
                    <Space direction="horizontal">
                      <Radio value="1">是</Radio>
                      <Radio value="0">否</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              )}

              {valueType === MetaValueType.Enum.Value && !item.IsRepeat && (
                <Form.Item
                  label={`${record?.Name}`}
                  name={`${item.Table}#${item.Field}`}
                  // className={styles.item}
                  rules={[{ required: true, message: `请选择${record?.Name}` }]}
                >
                  <Selector
                    onChange={arr => {
                      handleFieldChange(currentPath, arr, rootIndex);
                    }}
                    columns={2}
                    options={record?.map(item => {
                      return {
                        value: item.Value,
                        label: item.Desc,
                      };
                    })}
                    multiple
                  />
                </Form.Item>
              )}

              {valueType === MetaValueType.DateTime.Value && !item.IsRepeat && (
                <Form.Item
                  label={`${record?.Name}`}
                  name={`${item.Table}#${item.Field}`}
                  onClick={(e, datePickerRef: RefObject<DatePickerRef>) => {
                    datePickerRef.current?.open();
                  }}
                  trigger="onConfirm"
                  rules={[{ required: true, message: `请选择${record?.Name}` }]}
                >
                  <DatePicker
                    onConfirm={val => {
                      handleFieldChange(
                        currentPath,
                        moment(val).format('YYYY-MM-DD 00:00:00'),
                        rootIndex,
                      );
                    }}
                  >
                    {value =>
                      value
                        ? moment(value).format('YYYY-MM-DD')
                        : 'Please select'
                    }
                  </DatePicker>
                </Form.Item>
              )}
            </Fragment>
          );
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
        {renderContentList(
          node?.ContentList,
          `${prePath}|${nodeIndex}|ContentList`,
          preIndex,
        )}
        {renderConditions(
          node?.ChildList,
          `${prePath}|${nodeIndex}|ChildList`,
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
        <span className={styles.title}>深度匹配</span>
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
            <MatchNumber
              title="当前匹配结果："
              count={questionnaireDetail?.MatchRate}
            />
          </div>
          <div className={styles.list}>
            <Form
              layout="horizontal"
              form={form}
              onFinish={onSubmitCallback}
              onFinishFailed={({ values, errorFields, outOfDate }) => {
                console.log(values, errorFields, outOfDate);
              }}
              className={styles.renderForm}
            >
              {renderFieldEvaluateList(
                questionnaireDetail?.QuestionnaireDetail?.FieldEvaluateList,
              )}
            </Form>
          </div>
        </div>
        <div className={styles.footer}>
          <Button
            className={classNames({
              [styles.contentBtn]: true,
            })}
            onClick={() => {
              form.resetFields();
            }}
          >
            重置
          </Button>
          <Button
            className={classNames({
              [styles.contentBtn]: true,
              [styles.primary]: true,
            })}
            onClick={() => {
              form.submit();
            }}
          >
            深度匹配
          </Button>
        </div>
      </div>
    </div>
  );
}
