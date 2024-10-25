import {
  BASIC_DATA_TYPE,
  convertGenericTypeName2Combo,
  getDefinitionKeyByVoRef,
  getDefinitionKeyNoGenericType,
} from './utils';

import { each, isEmpty, isNil, filter, map, find, has } from 'lodash';

import { CommonTypeDefineFileName, PaginationVoName, Regx, ResponseVoName } from './config';
import type {
  ApiDocTypeDefine,
  DefinitionAttributeDefine,
  DefinitionPropertyDefine,
  DefinitionsType,
  ParametersDefine,
  MethodsDefine,
} from './types/ApiTypeDefine';

import { FileResourceDefine, MethodItem } from './types/DCTypeDefine';

export default class DefinitionsConverter {
  public paths: {
    [methodPath: string]: MethodsDefine;
  };
  public definitions: DefinitionsType;

  // 文件转换对象
  public fileResource: FileResourceDefine = {};

  // 已处理过的类型对应的文件名
  public allReferenceTypesMap: any = {};

  // 加载数据
  // 拆分path和definitions
  // 建立方法
  constructor(data: ApiDocTypeDefine) {
    this.definitions = data.definitions;
    this.paths = data.paths;
    this.fileResource = {
      [CommonTypeDefineFileName]: {},
    };
  }

  isReleasedMethod() {
    return true;
  }

  isArrayAttribute(attr: DefinitionAttributeDefine) {
    return attr.type === 'array' && !isEmpty(attr.items);
  }

  isObjectAttribute(attr: DefinitionAttributeDefine) {
    return !isNil(attr.$ref);
  }

  private changePropertiesToTplDesc(
    properties: DefinitionPropertyDefine,
    callback: (childDefinitionKey: string) => void,
  ) {
    // 遍历vo，看其属性类型,
    each(properties, (attr: DefinitionAttributeDefine, key) => {
      // 数组,$ref挂在items上
      if (this.isArrayAttribute(attr)) {
        if (attr?.items?.$ref) {
          // 转义,为数组这里就不可能为空
          const newVoDef = decodeURIComponent(attr?.items.$ref);
          // 根据ref获取voType，可能是泛型（响应或者分页）
          const childDefinitionKey = getDefinitionKeyByVoRef(newVoDef);
          // @NOTICE 避免类型嵌套引入，陷入死循环
          attr.type = `${childDefinitionKey}[]`;
          delete attr.items;
          callback(childDefinitionKey);
        } else {
          attr.type = `${attr.items?.type}[]`;
          delete attr.items;
        }
      } else if (this.isObjectAttribute(attr) && attr.$ref) {
        // 对象类型,直接定义$ref
        const newVoDef = decodeURIComponent(attr.$ref);
        // 根据ref获取voType，可能是泛型（响应或者分页）
        const childDefinitionKey = getDefinitionKeyByVoRef(newVoDef);
        // @NOTICE 避免类型嵌套引入，陷入死循环
        attr.type = `${childDefinitionKey}`;
        delete attr.$ref;
        callback(childDefinitionKey);
      } else {
        // @ts-ignore
        attr.type = BASIC_DATA_TYPE[attr.type] || attr.type;
      }
    });
  }

  /**
   * 获取属性的定义，包括嵌套，但如果是自身嵌套，则不需要再循环
   * @param noGenericDefinitionKey
   * @param dependenciesChain
   * @private
   */
  private getPropsDependenciesChain(
    noGenericDefinitionKey: string,
    dependenciesChain: {
      name: string;
      props: DefinitionPropertyDefine;
    }[] = [],
  ) {
    // definitionKey::TpCategoryVO TpResourceItemVO
    const vo = this.definitions[noGenericDefinitionKey];
    // 判断当前文件是否处理过，避免无限嵌套
    const matched = find(dependenciesChain, (item) => {
      return item.name === noGenericDefinitionKey;
    });

    // 还需要判断别的文件是否处理过，然后使用引用
    if (isEmpty(matched)) {
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

  private filterValidParamsKey(params: ParametersDefine[]) {
    return filter(params, (item: ParametersDefine) => {
      //  这两类请求需要转换类
      return ['body', 'query'].includes(item.in);
    });
  }

  /**
   * 遍历每个方法前，抽取公用的类
   * @param definitionKey
   * @private
   */
  private getCommonTypesDefine(definitionKey: string) {
    //  计算common类
    if (Regx.array.test(definitionKey) || Regx.basic.test(definitionKey)) {
      const matched = find(
        this.fileResource[CommonTypeDefineFileName].typeDefinitions,
        (item) => item.name === ResponseVoName,
      );
      if (isEmpty(matched)) {
        const props = this.definitions[definitionKey].properties;
        const tpResultVo = {
          name: ResponseVoName,
          props: props,
          genericType: ['T'],
        };
        // 一个泛型
        each(props, (prop, key) => {
          if (key === 'data') {
            prop.type = 'T';
            delete prop.$ref;
          } else if (prop.enum) {
            prop.type = prop.enum.map((item) => "'" + item + "'").join('|');
          } else {
            // @ts-ignore
            prop.type = BASIC_DATA_TYPE[prop.type];
          }
        });

        this.fileResource[CommonTypeDefineFileName].typeDefinitions =
          this.fileResource[CommonTypeDefineFileName].typeDefinitions || [];
        this.fileResource[CommonTypeDefineFileName].typeDefinitions.push(tpResultVo);
      }
    }

    if (Regx.withPage.test(definitionKey)) {
      const matched = find(
        this.fileResource[CommonTypeDefineFileName].typeDefinitions,
        (item) => item.name === PaginationVoName,
      );

      if (isEmpty(matched)) {
        const voName = definitionKey.replace(Regx.withPage, ($0, $1) => {
          return $1;
        });

        const props = this.definitions[`${PaginationVoName}«${voName}»`].properties;
        const paginationVo = {
          name: PaginationVoName,
          props: props,
          genericType: ['T'],
        };

        each(props, (prop, key) => {
          if (key === 'list') {
            prop.type = 'T';
            delete prop.$ref;
          } else {
            // @ts-ignore
            prop.type = BASIC_DATA_TYPE[prop.type];
          }
        });

        this.fileResource[CommonTypeDefineFileName].typeDefinitions =
          this.fileResource[CommonTypeDefineFileName].typeDefinitions || [];

        this.fileResource[CommonTypeDefineFileName].typeDefinitions.push(paginationVo);
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
  private listDepsByDefinitionsLink(linkStr: string) {
    const decodeLinkUrl = decodeURIComponent(linkStr);
    // 根据ref获取voType，可能是泛型（响应或者分页）
    const definitionKey = getDefinitionKeyByVoRef(decodeLinkUrl);

    // 提取公共类型
    this.getCommonTypesDefine(definitionKey);

    //@NOTICE 是泛型，将泛型和通用对象拿出去，只返回对应的泛型类；如果不匹配，则直接返回
    const noGenericTypeKey = getDefinitionKeyNoGenericType(definitionKey);

    // 如果是基础类型
    if (has(BASIC_DATA_TYPE, noGenericTypeKey)) {
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
  private getServiceAndTypeDefineFileNameByPath(methodPath: string, level = 2) {
    //     根据path、生成文件和serviceName
    const strArr = methodPath.split('/');
    return strArr[level];
  }

  /**
   * 根据方法路径，生成方法描述
   * @param methodPath
   */
  genServiceMethodByPath(methodPath: string) {
    console.log('###methodPath', methodPath);
    const fileName = this.getServiceAndTypeDefineFileNameByPath(methodPath);
    if (!this.fileResource[fileName]) {
      this.fileResource[fileName] = {
        methods: [],
        typeDefinitions: [],
      };
    }

    let typeDefinitions = this.fileResource[fileName].typeDefinitions || [];
    const typesDescNames = map(typeDefinitions, (item) => item.name);
    const methodDesc = this.paths[methodPath];

    each(methodDesc, (methodDetail, methodType) => {
      // 针对POST
      // 截取方法名
      const operationId = methodDetail.operationId;

      const result = operationId.replace(/(\w+)Using(\w+)/, ($0, methodName, type) => {
        return `${methodName},${type}`;
      });
      const [methodName, type] = result.split(',');

      const methodItem = new MethodItem();

      methodItem.name = methodName;
      methodItem.type = methodType || type.toLowerCase();
      methodItem.url = methodPath;
      methodItem.summary = methodDetail.summary;

      // 捞取query和body的请求描述
      const parameters = this.filterValidParamsKey(methodDetail.parameters);

      // GET请求
      const matchedParamInPostQuery = filter(parameters, (item) => {
        return item.in === 'query';
      });

      if (!isEmpty(matchedParamInPostQuery)) {
        const queryParams: any = {};
        each(matchedParamInPostQuery, (item) => {
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
      const matchedParamInPostBody = find(parameters, (item) => {
        return item.in === 'body';
      });
      if (!isEmpty(matchedParamInPostBody)) {
        // 参数的定义链接,也有可能不是ref，而是简单类型
        const paramsDefinitionLink = matchedParamInPostBody?.schema?.$ref;

        if (paramsDefinitionLink) {
          const newVoDef = decodeURIComponent(paramsDefinitionLink);
          // 根据ref获取voType，可能是泛型（响应或者分页）
          const definitionKey = getDefinitionKeyByVoRef(newVoDef);
          methodItem.params = definitionKey;

          const paramsDeps = this.listDepsByDefinitionsLink(paramsDefinitionLink).filter((item) => {
            return !typesDescNames.includes(item.name);
          });

          typeDefinitions = [...typeDefinitions, ...paramsDeps];
        } else {
          //   简单类型
        }
      }

      // 响应的定义链接,只看200，其他不看
      const responses = methodDetail.responses;
      const resp200DefinitionLink = responses['200'].schema.$ref;
      if (resp200DefinitionLink) {
        const newVoDef = decodeURIComponent(resp200DefinitionLink);
        const definitionKey = getDefinitionKeyByVoRef(newVoDef);
        // 根据ref获取voType，可能是泛型（响应或者分页）
        const respName = convertGenericTypeName2Combo(definitionKey);

        methodItem.response = respName;

        const respDeps = this.listDepsByDefinitionsLink(resp200DefinitionLink).filter((item) => {
          return !typesDescNames.includes(item.name);
        });
        typeDefinitions = [...typeDefinitions, ...respDeps];
      }

      this.fileResource[fileName].methods?.push(methodItem);
      this.fileResource[fileName].typeDefinitions = typeDefinitions;
    });
  }
}
