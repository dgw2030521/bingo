import { each } from 'lodash-es';

const META_KEY = 'META';

/**
 * 将pc端的formSchema协议转为支持h5的
 * 1、类型 枚举在pc端对应的都是string，但在h5对应的widget取值都是array
 * 2、内置支持的组件重新映射，比如select等
 * 3、readOnlyWidget 指定只读渲染组件
 *
 * @param formSchema
 */
const reMapWidget = (formSchema: any) => {
  each(formSchema.properties, (value: any, key) => {
    // 占位符
    if (value.title === ' ' && value.type === 'string') {
      //   识别为占位符
    }

    if (value.readOnly) {
      value.disabled = true;
    }

    // const enums = value.enum;
    // const enumNames = value.enumNames;
    // 单纯的input
    if (value.type === 'string' && !value.widget) {
      value.widget = 'input';
      value.placeholder = '请输入内容';
      // value.defaultValue = 'abc';
    }
    // 特殊数字展示，待unit
    if (value.type === 'number') {
      // type: 'number',
      // widget: 'stepper'
      value.widget = 'MyNumber';
    }
    // upload
    if (value.type === 'string' && value.widget === 'IOInvokerUpload') {
      value.widget = 'IOInvokerUpload';
      value.placeholder = '请上传';
      // h5的 token名称
      value.authorization = 'customer-h5-token';
      value.accept = 'image/*';
    }

    // 日期
    if (value.type === 'string' && value.format === 'date') {
      value.widget = 'datePicker';
      value.precision = 'day';
      value.format = 'YYYY-MM-DD';
    }
    //  时间
    if (value.type === 'string' && value.format === 'dateTime') {
      value.widget = 'datePicker';
      value.precision = 'minute';
      value.format = 'YYYY-MM-DD hh:mm';
    }
    // textarea
    if (value.type === 'string' && value.format === 'textarea') {
      value.widget = 'textArea';
      value.props = {
        showCount: true,
        autoSize: { minRows: 2, maxRows: 5 },
      };
    }

    // 下拉单选 picker
    if (value.widget === 'select') {
      // 内置的picker必须是array
      value.type = 'array';
      value.widget = 'picker';
    }

    // radio
    // type: 'string', widget: 'radio',

    // 单独checkBox
    if (value.type === 'boolean' && value.widget === 'checkbox') {
      // value.widget = 'selector';

      // 当 title 未设置时，通过配置 reserveLabel: true，可以保留 labelWidth 占位，使得输入控件和其他控件上下对齐
      // value.reserveLabel = true;

      value.widget = 'MyCheckBoxSingle';
    }
    // 多选checkBox
    if (value.type === 'array' && value.widget === 'checkboxes') {
      value.type = 'array';

      // value.widget = 'selector';
      // value.props = {
      //   multiple: true,
      // };

      value.widget = 'MyCheckBoxMultiple';
    }

    // 下拉多选
    if (value.widget === 'multiSelect') {
      value.type = 'array';

      value.placeholder = '请选择';

      value.widget = 'MySelect';

      // value.widget = 'selector';
      // value.props = {
      //   multiple: true,
      // };
    }
  });
};

const convertInitialValueBySchemaDefine = (
  metaKey: string,
  fieldCode: string,
  metaValue: any,
  renderSchema: any,
) => {
  const matchedSchemaDefine =
    renderSchema.properties[metaKey].properties[fieldCode];

  const matchedType = matchedSchemaDefine?.type;

  if (matchedType === 'array' && typeof metaValue === 'string') {
    metaValue = [metaValue];
  }

  return metaValue;
};

const demoSchema = {
  type: 'object',
  properties: {
    META_18616838766: {
      type: 'object',
      title: '卡片主题1',
      description: '这是一个对象类型',
      widget: 'formBox',
      props: { expand: true, hideExpandBtn: true },
      properties: {
        picker: {
          title: 'picker',
          type: 'array',
          widget: 'picker',
          required: true,
          enum: ['a', 'b', 'c'],
          enumNames: ['早', '中', '晚'],
          // props: {
          //   options: [
          //     { label: '火车', value: 1 },
          //     { label: '飞机', value: 2 },
          //     { label: '火箭', value: 3 },
          //   ],
          // },
        },
        input: {
          readOnly: true,
          title: '输入框',
          type: 'string',
          widget: 'input',
          required: true,
          placeholder: '请输入内容',
          defaultValue: '11111',
        },
        slider: {
          title: '滑动条',
          type: 'string',
          widget: 'slider',
        },
        switch: {
          title: '开关',
          type: 'bool',
          widget: 'switch',
          props: {
            uncheckedText: '关',
            checkedText: '开',
          },
        },
        stepper: {
          title: '步进器',
          type: 'number',
          widget: 'stepper',
        },
        selector3: {
          title: 'selector单选1',
          type: 'string',
          widget: 'selector',
          enum: ['a', 'b', 'c'],
          enumNames: ['早', '中', '晚'],
        },
        selector: {
          required: true,
          title: 'selector单选2',
          type: 'string',
          widget: 'selector',
          props: {
            options: [
              { label: 'A', value: 'a' },
              { label: 'B', value: 'b' },
              { label: 'C', value: 'c' },
              { label: 'D', value: 'd' },
              { label: 'E', value: 'e' },
              { label: 'F', value: 'f' },
            ],
          },
        },
        selector2: {
          required: true,
          title: 'selector多选',
          type: 'string',
          widget: 'selector',
          props: {
            multiple: true,
            options: [
              { label: 'A', value: 'a' },
              { label: 'B', value: 'b' },
              { label: 'C', value: 'c' },
              { label: 'D', value: 'd' },
              { label: 'E', value: 'e' },
              { label: 'F', value: 'f' },
            ],
          },
        },
        radio: {
          title: '单选Radio',
          type: 'string',
          widget: 'radio',
          enum: ['a', 'b', 'c'],
          enumNames: ['早', '中', '晚'],
        },
        MyCheckBoxSingle: {
          title: '单选Checkbox',
          type: 'boolean',
          widget: 'MyCheckBoxSingle',
        },
        MyCheckBoxMultiple: {
          title: '多选Checkbox',
          type: 'array',
          widget: 'MyCheckBoxMultiple',
          enum: ['a', 'b', 'c'],
          enumNames: ['早', '中', '晚'],
        },
        dateTime: {
          title: '时间',
          type: 'string',
          widget: 'datePicker',
          props: {
            precision: 'second',
          },
        },
        date: {
          title: '日期',
          type: 'string',
          widget: 'datePicker',
          props: {
            precision: 'day',
          },
        },
        city: {
          title: '城市',
          type: 'array',
          widget: 'cascader',
          props: {
            options: [
              {
                label: '浙江',
                value: 1,
                children: [{ label: '杭州', value: 2 }],
              },
            ],
          },
        },
      },
    },
    obj2: {
      type: 'object',
      title: '卡片主题2',
      description: '这是一个对象类型',
      widget: 'formBox',
      props: { hideExpandBtn: true },
      properties: {
        number_dQo1yu: {
          title: '金额',
          type: 'number',
          UnitName: '元',
          widget: 'MyNumber',
        },
        mySelect: {
          required: true,
          title: '下拉多选',
          type: 'array',
          widget: 'mySelect',
          enum: ['a', 'b', 'c'],
          enumNames: ['早', '中', '晚'],
        },
        selector: {
          required: true,
          title: '下拉多选',
          type: 'array',
          widget: 'MySelect',
          props: {
            multiple: true,
            options: [
              { label: 'A', value: 'a' },
              { label: 'B', value: 'b' },
              { label: 'C', value: 'c' },
              { label: 'D', value: 'd' },
              { label: 'E', value: 'e' },
              { label: 'F', value: 'f' },
            ],
          },
        },
      },
    },
  },
};

const pcSchema1 = {
  type: 'object',
  properties: {
    BeneficiaryCompanyName: {
      title: '受益企业名称',
      type: 'string',
      required: true,
      disabled: true,
      readOnly: false,
      displayType: 'row',
      __dataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
        __mataDataConfig: {
          entityId: 'meta_apply_company',
          metadata: 'BeneficiaryCompanyName',
        },
      },
      props: {},
    },
    BeneficiaryCreditCode: {
      title: '受益企业统一社会信用代码',
      type: 'string',
      required: true,
      disabled: true,
      readOnly: false,
      displayType: 'row',
      __dataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
        __mataDataConfig: {
          entityId: 'meta_apply_company',
          metadata: 'BeneficiaryCreditCode',
        },
      },
      props: {},
    },
    COMPANY_BANK_ID: {
      title: '财务信息',
      type: 'string',
      enum: ['a', 'b', 'c'],
      enumNames: ['早', '中', '晚'],
      widget: 'select',
      required: true,
      displayType: 'row',
      __dataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
        __mataDataConfig: {
          entityId: 'meta_apply_company',
          entityName: '',
          metadata: 'COMPANY_BANK_ID',
        },
      },
    },
  },
  column: 1,
  labelWidth: 120,
  displayType: 'row',
  colon: true,
  disabled: false,
};

const pcSchema2 = {
  type: 'object',
  properties: {
    input_TQCJ2R: {
      title: '输入框',
      type: 'string',
      displayType: 'row',
      __dataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
        __mataDataConfig: {
          entityId: 'meta_ceshi_01',
          entityName: '测试01',
          metadata: 'srk',
          dataSourceId: '4',
        },
      },
      __preDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
      __BackDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
      __externalApi: { __type: 0 },
    },
    textarea_R1YFPU: {
      title: '文本框',
      type: 'string',
      format: 'textarea',
      displayType: 'row',
      __dataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
        __mataDataConfig: {
          entityId: 'meta_ceshi_01',
          entityName: '测试01',
          metadata: 'wbk',
          dataSourceId: '4',
        },
      },
      __preDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
      __BackDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
    },
    date_QgFaQh: {
      title: '日期选择',
      type: 'string',
      format: 'dateTime',
      displayType: 'row',
      __dataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
        __mataDataConfig: {
          entityId: 'meta_ceshi_01',
          entityName: '测试01',
          metadata: 'riqi',
          dataSourceId: '4',
        },
      },
      __preDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
      __BackDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
      placeholder: '',
    },
    number_dQo1yu: {
      title: '数字输入框',
      type: 'number',
      displayType: 'row',
      __preDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
      __BackDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
      __dataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
        __mataDataConfig: {
          entityId: 'meta_ceshi_01',
          entityName: '测试01',
          metadata: 'szk',
          dataSourceId: '4',
        },
      },
    },
    checkbox_Uj2q07: {
      title: '是否选择',
      type: 'boolean',
      widget: 'checkbox',
      displayType: 'row',
      __dataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
        __mataDataConfig: {
          entityId: 'meta_ceshi_01',
          entityName: '测试01',
          metadata: 'shifou',
          dataSourceId: '4',
        },
      },
      __preDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
      __BackDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
    },
    select_BuKC6O: {
      title: '下拉单选',
      type: 'string',
      enum: [0, 1, 2, 3, 4, 5],
      enumNames: ['无', '非常不满意', '不满意', '基本满意', '满意', '非常满意'],
      widget: 'select',
      displayType: 'row',
      __preDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
      __BackDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
      __datasourceType: 'metadata',
      __enumList: {
        usedEnumId: '53',
        usedEnumNames: [
          '无',
          '非常不满意',
          '不满意',
          '基本满意',
          '满意',
          '非常满意',
        ],
        usedEnum: [0, 1, 2, 3, 4, 5],
      },
      __dataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
        __mataDataConfig: {
          entityId: 'meta_ceshi_01',
          entityName: '测试01',
          metadata: 'xialdanxuan1',
          dataSourceId: '4',
        },
      },
      enumList: [
        { value: 0, label: '无' },
        { value: 1, label: '非常不满意' },
        { value: 2, label: '不满意' },
        { value: 3, label: '基本满意' },
        { value: 4, label: '满意' },
        { value: 5, label: '非常满意' },
      ],
    },
    multiSelect_sPsXPQ: {
      title: '下拉多选',
      description: '',
      type: 'array',
      items: { type: 'string' },
      enum: [0, 1, 2, 3],
      enumNames: ['无', '企业', '个人', '企业给个人'],
      widget: 'multiSelect',
      displayType: 'row',
      __dataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
        __mataDataConfig: {
          entityId: 'meta_ceshi_01',
          entityName: '测试01',
          metadata: 'xialaduoxuan1',
          dataSourceId: '4',
        },
      },
      __preDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
      __BackDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
      __datasourceType: 'metadata',
      __enumList: {
        usedEnumId: '37',
        usedEnumNames: ['无', '企业', '个人', '企业给个人'],
        usedEnum: [0, 1, 2, 3],
      },
      enumList: [
        { value: 0, label: '无' },
        { value: 1, label: '企业' },
        { value: 2, label: '个人' },
        { value: 3, label: '企业给个人' },
      ],
    },
    radio_pPxKrk: {
      title: '点击单选',
      type: 'string',
      enum: [1, 2, 3, 4, 5],
      enumNames: ['国家级', '省级', '市级', '区县级', '乡镇级'],
      widget: 'radio',
      displayType: 'row',
      __dataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
        __mataDataConfig: {
          entityId: 'meta_ceshi_01',
          entityName: '测试01',
          metadata: 'dianjidanxuan1',
          dataSourceId: '4',
        },
      },
      __preDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
      __BackDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
      __datasourceType: 'metadata',
      __enumList: {
        usedEnumId: '43',
        usedEnumNames: ['国家级', '省级', '市级', '区县级', '乡镇级'],
        usedEnum: [1, 2, 3, 4, 5],
      },
      enumList: [
        { value: 1, label: '国家级' },
        { value: 2, label: '省级' },
        { value: 3, label: '市级' },
        { value: 4, label: '区县级' },
        { value: 5, label: '乡镇级' },
      ],
    },
    checkboxes_aqnbA4: {
      title: '点击多选',
      type: 'array',
      widget: 'checkboxes',
      items: { type: 'string' },
      enum: [0, 1, 2, 3, 4],
      enumNames: ['无', '未推送', '已推送', '已撤回', '草稿'],
      displayType: 'row',
      __dataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
        __mataDataConfig: {
          entityId: 'meta_ceshi_01',
          entityName: '测试01',
          metadata: 'dianjiduoxuan1',
          dataSourceId: '4',
        },
      },
      __preDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
      __BackDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
      __datasourceType: 'metadata',
      __enumList: {
        usedEnumId: '104',
        usedEnumNames: ['无', '未推送', '已推送', '已撤回', '草稿'],
        usedEnum: [0, 1, 2, 3, 4],
      },
      enumList: [
        { value: 0, label: '无' },
        { value: 1, label: '未推送' },
        { value: 2, label: '已推送' },
        { value: 3, label: '已撤回' },
        { value: 4, label: '草稿' },
      ],
    },
    upload_K4HlZF: {
      title: '上传文件',
      type: 'string',
      widget: 'IOInvokerUpload',
      readOnlyWidget: 'IOInvokerUpload',
      disabled: false,
      accept: '.doc,.pdf,.docx',
      maxCount: 5,
      fileSize: 5,
      tip: '',
      action: '/zczd/customer/app-customer/IO/uploadFile',
      authorization: 'token',
      __dataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
        __mataDataConfig: {
          entityId: 'meta_ceshi_01',
          entityName: '测试01',
          metadata: 'wenjian',
          dataSourceId: '4',
        },
      },
      __preDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
      __BackDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
    },
  },
  column: 1,
  labelWidth: 120,
  displayType: 'row',
  colon: true,
  disabled: false,
};

const pcSchema3 = {
  type: 'object',
  properties: {
    input_hMy0Sg: {
      title: '输入框',
      type: 'string',
      displayType: 'row',
      __dataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
        __mataDataConfig: {
          entityId: 'meta_cdsw',
          entityName: '成都商务局申报数据',
          metadata: 'zcd',
          dataSourceId: '4',
        },
      },
      __preDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
      __BackDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
      __externalApi: { __type: 0 },
    },
    upload_qkkhSg: {
      title: '上传文件',
      type: 'string',
      widget: 'IOInvokerUpload',
      readOnlyWidget: 'IOInvokerUpload',
      disabled: false,
      accept: '.doc,.pdf,.docx',
      maxCount: 5,
      fileSize: 5,
      tip: '',
      action: '/zczd/customer/app-customer/IO/uploadFile',
      authorization: 'token',
      __dataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
        __mataDataConfig: {
          entityId: 'meta_cdsw',
          entityName: '成都商务局申报数据',
          metadata: 'qycns',
          dataSourceId: '4',
        },
      },
      __preDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
      __BackDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
    },
  },
  column: 1,
  labelWidth: 120,
  displayType: 'row',
  colon: true,
  disabled: false,
};

const pcSchema4 = {
  type: 'object',
  properties: {
    input_DnmOmJ: {
      title: '输入框',
      type: 'string',
      displayType: 'row',
      __dataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
        __mataDataConfig: {
          entityId: 'meta_ceshi_02',
          entityName: '测试02',
          metadata: 'srk',
          dataSourceId: '4',
        },
      },
      __preDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
      __BackDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
      __externalApi: { __type: 0 },
    },
    select_ncWhbT: {
      title: '下拉单选',
      type: 'string',
      enum: ['a', 'b', 'c'],
      enumNames: ['早', '中', '晚'],
      widget: 'select',
      displayType: 'row',
      __preDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
      __BackDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
      __datasourceType: 'customize',
      __dataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
        __mataDataConfig: {
          entityId: 'meta_ceshi_02',
          entityName: '测试02',
          metadata: 'xialadanxuan',
          dataSourceId: '4',
        },
      },
    },
    radio_pwT6wZ: {
      title: '点击单选',
      type: 'string',
      enum: ['a', 'b', 'c'],
      enumNames: ['早', '中', '晚'],
      widget: 'radio',
      displayType: 'row',
      __dataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
        __mataDataConfig: {
          entityId: 'meta_ceshi_02',
          entityName: '测试02',
          metadata: 'dianjidanuxanzdy',
          dataSourceId: '4',
        },
      },
      __preDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
      __BackDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
      __datasourceType: 'customize',
    },
    multiSelect_Jbuzuh: {
      title: '下拉多选',
      description: '',
      type: 'array',
      items: { type: 'string' },
      enum: ['A', 'B', 'C', 'D'],
      enumNames: ['杭州', '武汉', '湖州', '贵阳'],
      widget: 'multiSelect',
      displayType: 'row',
      __dataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
        __mataDataConfig: {
          entityId: 'meta_ceshi_02',
          entityName: '测试02',
          metadata: 'xialaduoxuanzdy',
          dataSourceId: '4',
        },
      },
      __preDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
      __BackDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
      __datasourceType: 'customize',
    },
    number_zJbN0L: {
      title: '数字输入框',
      type: 'number',
      displayType: 'row',
      __preDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
      __BackDataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
      },
      __dataRelation: {
        __type: 'metadata',
        __secret: false,
        __union: false,
        __mataDataConfig: {
          entityId: 'meta_ceshi_02',
          entityName: '测试02',
          metadata: 'sz',
          dataSourceId: '4',
        },
      },
    },
  },
  column: 1,
  labelWidth: 120,
  displayType: 'row',
  colon: true,
  disabled: false,
};

export {
  convertInitialValueBySchemaDefine,
  demoSchema,
  META_KEY,
  pcSchema1,
  pcSchema2,
  pcSchema3,
  pcSchema4,
  reMapWidget,
};
