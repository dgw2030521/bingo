"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const lodash_1 = require("lodash");
const config_1 = require("./config");
const DCTypeDefine_1 = require("./types/DCTypeDefine");
class DefinitionsConverter {
    // 加载数据
    // 拆分path和definitions
    // 建立方法
    constructor(data) {
        // 文件转换对象
        this.fileResource = {};
        // 已处理过的类型对应的文件名
        this.allReferenceTypesMap = {};
        this.definitions = data.definitions;
        this.paths = data.paths;
        this.fileResource = {
            [config_1.CommonTypeDefineFileName]: {},
        };
    }
    isReleasedMethod() {
        return true;
    }
    isArrayAttribute(attr) {
        return attr.type === 'array' && !(0, lodash_1.isEmpty)(attr.items);
    }
    isObjectAttribute(attr) {
        return !(0, lodash_1.isNil)(attr.$ref);
    }
    changePropertiesToTplDesc(properties, callback) {
        // 遍历vo，看其属性类型,
        (0, lodash_1.each)(properties, (attr, key) => {
            var _a, _b;
            // 数组,$ref挂在items上
            if (this.isArrayAttribute(attr)) {
                if ((_a = attr === null || attr === void 0 ? void 0 : attr.items) === null || _a === void 0 ? void 0 : _a.$ref) {
                    // 转义,为数组这里就不可能为空
                    const newVoDef = decodeURIComponent(attr === null || attr === void 0 ? void 0 : attr.items.$ref);
                    // 根据ref获取voType，可能是泛型（响应或者分页）
                    const childDefinitionKey = (0, utils_1.getDefinitionKeyByVoRef)(newVoDef);
                    // @NOTICE 避免类型嵌套引入，陷入死循环
                    attr.type = `${childDefinitionKey}[]`;
                    delete attr.items;
                    callback(childDefinitionKey);
                }
                else {
                    attr.type = `${(_b = attr.items) === null || _b === void 0 ? void 0 : _b.type}[]`;
                    delete attr.items;
                }
            }
            else if (this.isObjectAttribute(attr) && attr.$ref) {
                // 对象类型,直接定义$ref
                const newVoDef = decodeURIComponent(attr.$ref);
                // 根据ref获取voType，可能是泛型（响应或者分页）
                const childDefinitionKey = (0, utils_1.getDefinitionKeyByVoRef)(newVoDef);
                // @NOTICE 避免类型嵌套引入，陷入死循环
                attr.type = `${childDefinitionKey}`;
                delete attr.$ref;
                callback(childDefinitionKey);
            }
            else {
                // @ts-ignore
                attr.type = utils_1.BASIC_DATA_TYPE[attr.type] || attr.type;
            }
        });
    }
    /**
     * 获取属性的定义，包括嵌套，但如果是自身嵌套，则不需要再循环
     * @param noGenericDefinitionKey
     * @param dependenciesChain
     * @private
     */
    getPropsDependenciesChain(noGenericDefinitionKey, dependenciesChain = []) {
        // definitionKey::TpCategoryVO TpResourceItemVO
        const vo = this.definitions[noGenericDefinitionKey];
        // 判断当前文件是否处理过，避免无限嵌套
        const matched = (0, lodash_1.find)(dependenciesChain, (item) => {
            return item.name === noGenericDefinitionKey;
        });
        // 还需要判断别的文件是否处理过，然后使用引用
        if ((0, lodash_1.isEmpty)(matched)) {
            dependenciesChain.unshift({
                name: noGenericDefinitionKey,
                props: vo.properties,
            });
        }
        this.changePropertiesToTplDesc(vo.properties, (childDefinitionKeyNoGeneric) => {
            if (childDefinitionKeyNoGeneric !== noGenericDefinitionKey) {
                this.getPropsDependenciesChain(childDefinitionKeyNoGeneric, dependenciesChain);
            }
        });
        return dependenciesChain;
    }
    filterValidParamsKey(params) {
        return (0, lodash_1.filter)(params, (item) => {
            //  这两类请求需要转换类
            return ['body', 'query'].includes(item.in);
        });
    }
    /**
     * 遍历每个方法前，抽取公用的类
     * @param definitionKey
     * @private
     */
    getCommonTypesDefine(definitionKey) {
        //  计算common类
        if (config_1.Regx.array.test(definitionKey) || config_1.Regx.basic.test(definitionKey)) {
            const matched = (0, lodash_1.find)(this.fileResource[config_1.CommonTypeDefineFileName].typeDefinitions, (item) => item.name === config_1.ResponseVoName);
            if ((0, lodash_1.isEmpty)(matched)) {
                const props = this.definitions[definitionKey].properties;
                const tpResultVo = {
                    name: config_1.ResponseVoName,
                    props: props,
                    genericType: ['T'],
                };
                // 一个泛型
                (0, lodash_1.each)(props, (prop, key) => {
                    if (key === 'data') {
                        prop.type = 'T';
                        delete prop.$ref;
                    }
                    else if (prop.enum) {
                        prop.type = prop.enum.map((item) => "'" + item + "'").join('|');
                    }
                    else {
                        // @ts-ignore
                        prop.type = utils_1.BASIC_DATA_TYPE[prop.type];
                    }
                });
                this.fileResource[config_1.CommonTypeDefineFileName].typeDefinitions =
                    this.fileResource[config_1.CommonTypeDefineFileName].typeDefinitions || [];
                this.fileResource[config_1.CommonTypeDefineFileName].typeDefinitions.push(tpResultVo);
            }
        }
        if (config_1.Regx.withPage.test(definitionKey)) {
            const matched = (0, lodash_1.find)(this.fileResource[config_1.CommonTypeDefineFileName].typeDefinitions, (item) => item.name === config_1.PaginationVoName);
            if ((0, lodash_1.isEmpty)(matched)) {
                const voName = definitionKey.replace(config_1.Regx.withPage, ($0, $1) => {
                    return $1;
                });
                const props = this.definitions[`${config_1.PaginationVoName}«${voName}»`].properties;
                const paginationVo = {
                    name: config_1.PaginationVoName,
                    props: props,
                    genericType: ['T'],
                };
                (0, lodash_1.each)(props, (prop, key) => {
                    if (key === 'list') {
                        prop.type = 'T';
                        delete prop.$ref;
                    }
                    else {
                        // @ts-ignore
                        prop.type = utils_1.BASIC_DATA_TYPE[prop.type];
                    }
                });
                this.fileResource[config_1.CommonTypeDefineFileName].typeDefinitions =
                    this.fileResource[config_1.CommonTypeDefineFileName].typeDefinitions || [];
                this.fileResource[config_1.CommonTypeDefineFileName].typeDefinitions.push(paginationVo);
            }
        }
    }
    /**
     * 拿到params或者responses的schema生成vo或者dto,会自动提取出泛型类
     *
     * 记录所有的类所在的文件名
     *
     * @param linkStr
     */
    listDepsByDefinitionsLink(linkStr) {
        const decodeLinkUrl = decodeURIComponent(linkStr);
        // 根据ref获取voType，可能是泛型（响应或者分页）
        const definitionKey = (0, utils_1.getDefinitionKeyByVoRef)(decodeLinkUrl);
        // 提取公共类型
        this.getCommonTypesDefine(definitionKey);
        //@NOTICE 是泛型，将泛型和通用对象拿出去，只返回对应的泛型类；如果不匹配，则直接返回
        const noGenericTypeKey = (0, utils_1.getDefinitionKeyNoGenericType)(definitionKey);
        // 如果是基础类型
        if ((0, lodash_1.has)(utils_1.BASIC_DATA_TYPE, noGenericTypeKey)) {
            return [];
        }
        // 复杂类型
        return this.getPropsDependenciesChain(noGenericTypeKey, []);
    }
    /**
     * /tpmng/customer/enterprise/list 获得文件名
     * @param methodPath
     * @param level
     */
    getServiceAndTypeDefineFileNameByPath(methodPath, level = 2) {
        //     根据path、生成文件和serviceName
        const strArr = methodPath.split('/');
        return strArr[level];
    }
    /**
     * 根据方法路径，生成方法描述
     * @param methodPath
     */
    genServiceMethodByPath(methodPath) {
        console.log('###methodPath', methodPath);
        const fileName = this.getServiceAndTypeDefineFileNameByPath(methodPath);
        if (!this.fileResource[fileName]) {
            this.fileResource[fileName] = {
                methods: [],
                typeDefinitions: [],
            };
        }
        let typeDefinitions = this.fileResource[fileName].typeDefinitions || [];
        const typesDescNames = (0, lodash_1.map)(typeDefinitions, (item) => item.name);
        const methodDesc = this.paths[methodPath];
        (0, lodash_1.each)(methodDesc, (methodDetail, methodType) => {
            var _a, _b;
            // 针对POST
            // 截取方法名
            const operationId = methodDetail.operationId;
            const result = operationId.replace(/(\w+)Using(\w+)/, ($0, methodName, type) => {
                return `${methodName},${type}`;
            });
            const [methodName, type] = result.split(',');
            const methodItem = new DCTypeDefine_1.MethodItem();
            methodItem.name = methodName;
            methodItem.type = methodType || type.toLowerCase();
            methodItem.url = methodPath;
            methodItem.summary = methodDetail.summary;
            // 捞取query和body的请求描述
            const parameters = this.filterValidParamsKey(methodDetail.parameters);
            // GET请求
            const matchedParamInPostQuery = (0, lodash_1.filter)(parameters, (item) => {
                return item.in === 'query';
            });
            if (!(0, lodash_1.isEmpty)(matchedParamInPostQuery)) {
                const queryParams = {};
                (0, lodash_1.each)(matchedParamInPostQuery, (item) => {
                    queryParams[item.name] = {
                        type: item.type,
                        description: item.description,
                    };
                });
                typeDefinitions = [
                    ...typeDefinitions,
                    {
                        name: `${methodName}Params`,
                        props: queryParams,
                    },
                ];
                methodItem.params = `${methodName}Params`;
            }
            // POST请求
            const matchedParamInPostBody = (0, lodash_1.find)(parameters, (item) => {
                return item.in === 'body';
            });
            if (!(0, lodash_1.isEmpty)(matchedParamInPostBody)) {
                // 参数的定义链接,也有可能不是ref，而是简单类型
                const paramsDefinitionLink = (_a = matchedParamInPostBody === null || matchedParamInPostBody === void 0 ? void 0 : matchedParamInPostBody.schema) === null || _a === void 0 ? void 0 : _a.$ref;
                if (paramsDefinitionLink) {
                    const newVoDef = decodeURIComponent(paramsDefinitionLink);
                    // 根据ref获取voType，可能是泛型（响应或者分页）
                    const definitionKey = (0, utils_1.getDefinitionKeyByVoRef)(newVoDef);
                    methodItem.params = definitionKey;
                    const paramsDeps = this.listDepsByDefinitionsLink(paramsDefinitionLink).filter((item) => {
                        return !typesDescNames.includes(item.name);
                    });
                    typeDefinitions = [...typeDefinitions, ...paramsDeps];
                }
                else {
                    //   简单类型
                }
            }
            // 响应的定义链接,只看200，其他不看
            const responses = methodDetail.responses;
            const resp200DefinitionLink = responses['200'].schema.$ref;
            if (resp200DefinitionLink) {
                const newVoDef = decodeURIComponent(resp200DefinitionLink);
                const definitionKey = (0, utils_1.getDefinitionKeyByVoRef)(newVoDef);
                // 根据ref获取voType，可能是泛型（响应或者分页）
                const respName = (0, utils_1.convertGenericTypeName2Combo)(definitionKey);
                methodItem.response = respName;
                const respDeps = this.listDepsByDefinitionsLink(resp200DefinitionLink).filter((item) => {
                    return !typesDescNames.includes(item.name);
                });
                typeDefinitions = [...typeDefinitions, ...respDeps];
            }
            (_b = this.fileResource[fileName].methods) === null || _b === void 0 ? void 0 : _b.push(methodItem);
            this.fileResource[fileName].typeDefinitions = typeDefinitions;
        });
    }
}
exports.default = DefinitionsConverter;
