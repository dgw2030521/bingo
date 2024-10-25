// 分页对象
export const PaginationVoName = 'CommonPage';
// 响应结果
export const ResponseVoName = 'TpResult';
// 公共类存放在此
export const CommonTypeDefineFileName = '$common';

export const Regx = {
  /**
   * 基础数据类型和普通对象返回 TpResult«TpCategoryVO»
   */
  basic: new RegExp(`${ResponseVoName}«(\\w+)»`),
  /**
   * 分页数据 TpResult«CommonPage«TpCategoryVO»»
   */
  withPage: new RegExp(`${ResponseVoName}«${PaginationVoName}«(\\w+)»»`),
  /**
   * 返回列表 TpResult«List«TpCategoryVO»»
   */
  array: new RegExp(`${ResponseVoName}«List«(\\w+)»»`),
};
