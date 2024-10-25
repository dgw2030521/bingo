export interface ParametersDefine {
  name: string;
  in: string;
  schema?: {
    $ref: string;
  };

  type?: string;
  required?: boolean;
  description?: string;
}

export interface ResponsesDefine {
  description: string;
  schema: {
    $ref?: string;
    type?: string;
    properties?: object;
  };
}

export interface MethodDetailDefine {
  summary: string;
  deprecated: boolean;
  description: string;
  operationId: string;
  parameters: ParametersDefine[];
  responses: {
    200: ResponsesDefine;
  };
}

export interface MethodsDefine {
  post: MethodDetailDefine;
  get: MethodDetailDefine;
}
export interface DefinitionAttributeDefine {
  type?: string;
  format?: string;
  description?: string;
  // 可能数组
  items?: {
    $ref?: string;
    type?: string;
  };
  $ref?: string;
  enum?: string[];
}

export interface DefinitionPropertyDefine {
  data: {
    // 基础类型
    type?: string;
    // 分页数组对象
    items?: {
      $ref: string;
    };
    // 复杂对象
    $ref?: string;
  };
  errorCode: {
    type: string;
  };
  errorDesc: {
    type: string;
  };
  errorType: {
    type: string;
    enum: string[];
  };
  exceptionType: {
    type: string;
  };
  success: {
    type: string;
  };

  [index: string]: DefinitionAttributeDefine;
}

export interface DefinitionsType {
  [index: string]: {
    type: string;
    properties: DefinitionPropertyDefine;
    title: string;
  };
}

/**
 * Api的接口文档类型定义
 */
export interface ApiDocTypeDefine {
  info: {
    title: string;
    description: string;
    version: string;
  };
  paths: {
    [path: string]: MethodsDefine;
  };
  swagger: string;
  definitions: DefinitionsType;
}
