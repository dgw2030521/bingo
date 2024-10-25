"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BASIC_DATA_TYPE = exports.getDefinitionKeyNoGenericType = exports.getDefinitionKeyByVoRef = exports.convertGenericTypeName2Combo = void 0;
exports.beautifyText = beautifyText;
const config_1 = require("./config");
const js_beautify_1 = require("js-beautify");
/**
 * 转换泛型和VO的组合，方便创建service的时候指定返回类型
 * 分页组合
 * 直接返回：对象、数组、基本数据类型
 * @param respRef
 */
const convertGenericTypeName2Combo = (respRef) => {
    // TpResult«List«TpCategoryVO»»
    // TpResult«TpCategoryVO»
    // TpResult«CommonData«TpCategoryVO»»
    if (config_1.Regx.array.test(respRef)) {
        const voName = respRef.replace(config_1.Regx.array, ($0, $1) => {
            return $1;
        });
        return `${config_1.ResponseVoName}<${voName}[]>`;
    }
    else if (config_1.Regx.withPage.test(respRef)) {
        const voName = respRef.replace(config_1.Regx.withPage, ($0, $1) => {
            return $1;
        });
        return `${config_1.ResponseVoName}<${config_1.PaginationVoName}<${voName}>>`;
    }
    else if (config_1.Regx.basic.test(respRef)) {
        const voName = respRef.replace(config_1.Regx.basic, ($0, $1) => {
            return $1;
        });
        return `${config_1.ResponseVoName}<${voName}>`;
    }
    return 'any';
};
exports.convertGenericTypeName2Combo = convertGenericTypeName2Combo;
/**
 * 获取defiinitionKey
 * #/definitions/TpEnterpriseVO
 * @param voRef
 */
const getDefinitionKeyByVoRef = (voRef) => {
    const strArr = voRef === null || voRef === void 0 ? void 0 : voRef.split('/');
    return strArr[2];
};
exports.getDefinitionKeyByVoRef = getDefinitionKeyByVoRef;
/**
 * 根据泛型获取基础类，排除响应体和分页对象
 * @param voKey
 */
const getDefinitionKeyNoGenericType = (voKey) => {
    let matchRst;
    if (config_1.Regx.array.test(voKey)) {
        matchRst = config_1.Regx.array.exec(voKey);
    }
    else if (config_1.Regx.withPage.test(voKey)) {
        matchRst = config_1.Regx.withPage.exec(voKey);
    }
    else if (config_1.Regx.basic.test(voKey)) {
        matchRst = config_1.Regx.basic.exec(voKey);
    }
    return (matchRst === null || matchRst === void 0 ? void 0 : matchRst[1]) || voKey;
};
exports.getDefinitionKeyNoGenericType = getDefinitionKeyNoGenericType;
const BASIC_DATA_TYPE = {
    string: 'string',
    integer: 'number',
    int: 'number',
    long: 'string',
    array: 'Array',
    file: 'Blob',
    boolean: 'boolean',
};
exports.BASIC_DATA_TYPE = BASIC_DATA_TYPE;
function beautifyText(text) {
    return (0, js_beautify_1.js_beautify)(text, {
        indent_size: 4,
        space_in_empty_paren: false,
    });
}
