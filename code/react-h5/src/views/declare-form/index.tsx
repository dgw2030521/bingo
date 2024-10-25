import { Button, Checkbox, Form, Input } from 'antd-mobile';
import classNames from 'classnames';
import FormRender, { useForm } from 'form-render-mobile';
import React from 'react';

import UploadImage from '@/views/declare-form/components/Upload';
import { demoSchema } from '@/views/declare-form/utils';
import FormBox from '@/views/declare-form/widgets/formBox';
import IOInvokerUpload from '@/views/declare-form/widgets/IOInvokerUpload';
import MyLink from '@/views/declare-form/widgets/link';
import MyCheckBoxMultiple from '@/views/declare-form/widgets/MyCheckBoxMultiple';
import MyCheckBoxSingle from '@/views/declare-form/widgets/MyCheckBoxSingle';
import MyNumber from '@/views/declare-form/widgets/MyNumber';
import MySelect from '@/views/declare-form/widgets/MySelect';

import styles from './index.module.scss';

export default function DeclareForm() {
  const [baseForm] = Form.useForm();
  const metaForm = useForm();

  const handleSave = async () => {
    const [baseValues, metaValues] = await Promise.all([
      baseForm.getFieldsValue(),
      metaForm.getFieldsValue(),
    ]);
    console.log('###no validate metaValues', baseValues, metaValues);
  };

  const handleSubmitApply = async () => {
    const [baseValues, metaValues] = await Promise.all([
      baseForm.validateFields(),
      metaForm.validateFields(),
    ]);

    console.log('###validate metaValues', baseValues, metaValues);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Form layout="horizontal" className={styles.form} form={baseForm}>
          <FormBox title="基础表单" expand>
            <Form.Item
              name="IdCard"
              label={<div className={styles.label}>身份证号</div>}
              rules={[{ required: true, message: '必填项' }]}
            >
              <Input disabled placeholder="请输入" />
            </Form.Item>

            <Form.Item
              name="Name"
              label={<div className={styles.label}>申报人姓名</div>}
              rules={[{ required: true, message: '必填项' }]}
            >
              <Input disabled placeholder="请输入" />
            </Form.Item>

            <Form.Item
              name="Phone"
              label={<div className={styles.label}>申报人手机号</div>}
              rules={[{ required: true, message: '必填项' }]}
            >
              <Input disabled placeholder="请输入" />
            </Form.Item>

            <Form.Item
              name="AttachProof"
              label={<div className={styles.label}>营业执照</div>}
            >
              <UploadImage
                maxCount={5}
                fileSize={5}
                memo="若营业执照内容有变更，请在此重新上传；支持扩展名：pdf、jepg、jpg、png，单文件5M内大小"
              />
            </Form.Item>
          </FormBox>
        </Form>

        <FormRender
          readOnly={false}
          className={styles.form}
          displayType="row"
          removeHiddenData={false}
          schema={demoSchema}
          form={metaForm}
          widgets={{
            formBox: FormBox,
            Link: MyLink,
            IOInvokerUpload,
            MyNumber,
            MyCheckBoxSingle,
            MySelect,
            MyCheckBoxMultiple,
          }}
        />

        <FormBox title="承诺函" hideExpandBtn>
          <div className={styles.promiseBox}>
            <div className={styles.content}>测试协议和合同</div>
            <div className={styles.operate}>
              <Checkbox checked disabled>
                阅读并签订承诺函
              </Checkbox>
            </div>
          </div>
        </FormBox>
      </div>
      <div className={styles.btnContainer}>
        <Button
          className={classNames({
            [styles.btn]: true,
            [styles.save]: true,
          })}
          onClick={() => {
            handleSave();
          }}
        >
          保存
        </Button>
        <Button
          onClick={() => {
            handleSubmitApply();
          }}
          className={classNames({
            [styles.btn]: true,
            [styles.submit]: true,
          })}
        >
          提交申请
        </Button>
      </div>
    </div>
  );
}
