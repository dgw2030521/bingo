import { endsWith } from 'lodash-es';
import { MetaValueType } from '@CodeDefine/customer/MetaValueType';
import moment from 'moment/moment';
import { MetaEnumRO } from '@CodeDefine/customer/MetaEnumRO';
import { PolicyFieldValuateNodeTO } from '@CodeDefine/customer/PolicyFieldValuateNodeTO';
import { PolicyFieldConditionTreeTO } from '@CodeDefine/customer/PolicyFieldConditionTreeTO';

export function getOperationPath(nodePath: string) {
  const pathAddress = nodePath.split('|');
  let pathStr = '';
  for (let i = 0; i < pathAddress?.length; i++) {
    const key = pathAddress[i];
    if (key === '-') {
      pathStr += '';
    } else if (Number.parseInt(key, 10) >= 0) {
      pathStr += `[${key}].`;
    } else if (['ContentList', 'ChildList'].includes(key)) {
      pathStr += `${key}`;
    } else {
      pathStr += `${key}.`;
    }
  }

  // 最后一位是小数点，才截取
  if (endsWith(pathStr, '.')) {
    return pathStr.substring(0, pathStr.length - 1);
  }

  return pathStr;
}

// 铺平所有ContentList
export function flattenConditionContents(points: PolicyFieldValuateNodeTO[]) {
  const result = [];

  // 遍历每个 Point
  points.forEach(point => {
    // 辅助函数，递归处理 Condition 中的 ContentList
    function flattenCondition(condition: PolicyFieldConditionTreeTO) {
      result.push(...condition.ContentList); // 将当前 Condition 的 ContentList 加入结果数组

      // 递归处理 ChildList 中的每一个 Condition
      condition.ChildList.forEach(child => {
        flattenCondition(child);
      });
    }

    // 调用辅助函数处理当前 Point 的 Condition
    flattenCondition(point.Condition);
  });

  return result;
}

export const transformFormData = (
  fieldEvaluateList: PolicyFieldValuateNodeTO[],
  metaTreeData: any[],
  metaAll: MetaEnumRO[],
) => {
  const obj = {};

  flattenConditionContents(fieldEvaluateList).forEach(item => {
    const record = metaTreeData
      ?.find(res => res.UUKey === item.Table)
      ?.FieldList?.find(res => res.Code === item.Field);
    const valueType = record?.ValueType?._value || 0;
    const options =
      valueType === MetaValueType.Bool.Value
        ? [
            { value: 1, label: '是' },
            { value: 0, label: '否' },
          ]
        : metaAll
            .find(rst => rst.UUKey === record?.ValueGenericType)
            ?.MemberList.map((info: any) => {
              return {
                value: info.Value,
                label: info.Desc,
              };
            });

    obj[`${item.Table}#${item.Field}`] = item.ValueSelected;

    if (
      (valueType === MetaValueType.Bool.Value ||
        valueType === MetaValueType.Enum.Value) &&
      options?.length > 5
    ) {
      obj[`${item.Table}#${item.Field}`] = JSON.parse(
        item.ValueSelected === '' ? null : item.ValueSelected ?? null,
      );
    }

    if (valueType === MetaValueType.DateTime.Value) {
      obj[`${item.Table}#${item.Field}`] = item?.ValueSelected
        ? moment(item?.ValueSelected)
        : undefined;
    }
  });

  return obj;
};
