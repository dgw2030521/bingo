import { PaginationVoName, Regx, ResponseVoName } from './config';
import { js_beautify } from 'js-beautify';

/**
 * 转换泛型和VO的组合，方便创建service的时候指定返回类型
 * 分页组合
 * 直接返回：对象、数组、基本数据类型
 * @param respRef
 */

const convertGenericTypeName2Combo = (respRef: string) => {
  // TpResult«List«TpCategoryVO»»
  // TpResult«TpCategoryVO»
  // TpResult«CommonData«TpCategoryVO»»
  if (Regx.array.test(respRef)) {
    const voName = respRef.replace(Regx.array, ($0, $1) => {
      return $1;
    });
    return `${ResponseVoName}<${voName}[]>`;
  } else if (Regx.withPage.test(respRef)) {
    const voName = respRef.replace(Regx.withPage, ($0, $1) => {
      return $1;
    });

    return `${ResponseVoName}<${PaginationVoName}<${voName}>>`;
  } else if (Regx.basic.test(respRef)) {
    const voName = respRef.replace(Regx.basic, ($0, $1) => {
      return $1;
    });
    return `${ResponseVoName}<${voName}>`;
  }
  return 'any';
};

/**
 * 获取defiinitionKey
 * #/definitions/TpEnterpriseVO
 * @param voRef
 */
const getDefinitionKeyByVoRef = (voRef: string) => {
  const strArr = voRef?.split('/');
  return strArr[2];
};

/**
 * 根据泛型获取基础类，排除响应体和分页对象
 * @param voKey
 */
const getDefinitionKeyNoGenericType = (voKey: string) => {
  let matchRst;
  if (Regx.array.test(voKey)) {
    matchRst = Regx.array.exec(voKey);
  } else if (Regx.withPage.test(voKey)) {
    matchRst = Regx.withPage.exec(voKey);
  } else if (Regx.basic.test(voKey)) {
    matchRst = Regx.basic.exec(voKey);
  }
  return matchRst?.[1] || voKey;
};

const BASIC_DATA_TYPE = {
  string: 'string',
  integer: 'number',
  int: 'number',
  long: 'string',
  array: 'Array',
  file: 'Blob',
  boolean: 'boolean',
};

function beautifyText(text: string) {
  return js_beautify(text, {
    indent_size: 4,
    space_in_empty_paren: false,
  });
}

export {
  convertGenericTypeName2Combo,
  getDefinitionKeyByVoRef,
  getDefinitionKeyNoGenericType,
  BASIC_DATA_TYPE,
  beautifyText,
};
