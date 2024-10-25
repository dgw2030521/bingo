import React, { Fragment, RefObject } from 'react';
import { QuestionnaireRO } from '@CodeDefine/customer/QuestionnaireRO';
import {
  DatePicker,
  DatePickerRef,
  Form,
  Input,
  Picker,
  Selector,
  Radio,
  Space,
} from 'antd-mobile';
import moment from 'moment';
import { find, map } from 'lodash-es';
import { MetaValueType } from '@CodeDefine/customer/MetaValueType';
import styles from './index.module.scss';

interface RenderFormProps {
  questionDetail: QuestionnaireRO;
  formConfig: any;
  metaAll: any;
  metaTreeData: any;
  form: any;
  onSubmit: (values: any) => void;
}
export default function RenderForm(props: RenderFormProps) {
  console.log('####RenderForm props', props);
  const { questionDetail, formConfig, metaAll, metaTreeData, form, onSubmit } =
    props;

  const renderItems = (
    metaDetail: any,
    metaItem: any,
    matchedHistoryDataItem: any,
    record?: any,
  ) => {
    if (metaDetail?.ValueType?._value === MetaValueType.Bool.Value) {
      return (
        <Form.Item
          label={metaItem.Name}
          name={metaItem.Code}
          rules={[
            {
              required: metaItem.Required?.[0] === 1,
              message: `请选择${metaItem.Name}`,
            },
          ]}
          initialValue={matchedHistoryDataItem?.Value}
        >
          <Radio.Group>
            <Space direction="vertical">
              <Radio value="1">是</Radio>
              <Radio value="0">否</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
      );
    }
    // 时间选择 datepicker
    if (metaDetail?.ValueType?._value === MetaValueType.DateTime.Value) {
      return (
        <Form.Item
          rules={[
            {
              required: metaItem.Required?.[0] === 1,
              message: `请选择${metaItem.Name}`,
            },
          ]}
          initialValue={
            matchedHistoryDataItem?.Value
              ? moment(matchedHistoryDataItem?.Value)
              : undefined
          }
          label={metaItem.Name}
          name={metaItem.Code}
          // @NOTICE Picker 组件的确认事件是 onConfirm 而不是 onChange，需要配置一下 trigger
          trigger="onConfirm"
          // @NOTICE antd-mobile 提供了一个便捷方法，你可以在 Form.Item 的 onClick 事件中，直接获取到内部 children 的 ref
          onClick={(e, datePickerRef: RefObject<DatePickerRef>) => {
            datePickerRef.current?.open();
          }}
        >
          <DatePicker>
            {value =>
              value
                ? moment(value).format('YYYY-MM-DD')
                : `请选择${metaItem.Name}`
            }
          </DatePicker>
        </Form.Item>
      );
    }

    // 枚举 selector
    if (
      metaDetail?.ValueType?._value === MetaValueType.Enum.Value ||
      metaDetail?.ValueType?._value === MetaValueType.ForeignKey.Value
    ) {
      return (
        <Form.Item
          label={metaItem.Name}
          name={metaItem.Code}
          rules={[
            {
              required: metaItem.Required?.[0] === 1,
              message: `请选择${metaItem.Name}`,
            },
          ]}
          initialValue={JSON.parse(matchedHistoryDataItem?.Value ?? null)}
        >
          <Selector
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
      );
    }

    if (
      metaDetail?.ValueType?._value === MetaValueType.Int.Value ||
      metaDetail?.ValueType?._value === MetaValueType.Long.Value ||
      metaDetail?.ValueType?._value === MetaValueType.Double.Value ||
      metaDetail?.ValueType?._value === MetaValueType.String.Value ||
      metaDetail?.ValueType?._value === MetaValueType.Text.Value
    ) {
      return (
        <Form.Item
          initialValue={matchedHistoryDataItem?.Value}
          label={metaItem.Name}
          name={metaItem.Code}
          rules={[
            {
              required: metaItem.Required?.[0] === 1,
              message: `请输入${metaItem.Name}`,
            },
          ]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
      );
    }
  };

  return (
    <>
      <div className={styles.header}>企业问卷</div>
      <Form
        layout="horizontal"
        form={form}
        onFinish={onSubmit}
        className={styles.renderForm}
      >
        {map(formConfig, (item, idx) => {
          return (
            <Fragment key={idx}>
              {map(item.Item, metaItem => {
                const code = metaItem.Code;
                const codeList = metaItem.Code?.split('#');
                const metaDetail = metaTreeData
                  ?.find(res => res?.value === codeList[0])
                  ?.children.find(res => res?.value === code);
                const record = metaAll.find(
                  res => res?.UUKey === metaDetail?.ValueGenericType,
                )?.MemberList;

                const historyData = questionDetail?.HistroyData;
                const matchedHistoryDataItem = find(historyData, _item => {
                  return _item.Key === code;
                });

                return (
                  <div className={styles.formItem} key={code}>
                    {renderItems(
                      metaDetail,
                      metaItem,
                      matchedHistoryDataItem,
                      record,
                    )}
                  </div>
                );
              })}
            </Fragment>
          );
        })}
      </Form>
    </>
  );
}
