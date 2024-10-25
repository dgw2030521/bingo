"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Regx = exports.CommonTypeDefineFileName = exports.ResponseVoName = exports.PaginationVoName = void 0;
// 分页对象
exports.PaginationVoName = 'CommonPage';
// 响应结果
exports.ResponseVoName = 'TpResult';
// 公共类存放在此
exports.CommonTypeDefineFileName = '$common';
exports.Regx = {
    /**
     * 基础数据类型和普通对象返回 TpResult«TpCategoryVO»
     */
    basic: new RegExp(`${exports.ResponseVoName}«(\\w+)»`),
    /**
     * 分页数据 TpResult«CommonPage«TpCategoryVO»»
     */
    withPage: new RegExp(`${exports.ResponseVoName}«${exports.PaginationVoName}«(\\w+)»»`),
    /**
     * 返回列表 TpResult«List«TpCategoryVO»»
     */
    array: new RegExp(`${exports.ResponseVoName}«List«(\\w+)»»`),
};
