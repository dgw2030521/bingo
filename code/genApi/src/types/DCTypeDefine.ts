export class MethodItem {
  name: string;
  type: string;
  params: string;
  response: string;
  url: string;
  summary: string;

  constructor() {
    this.name = '';
    this.type = '';
    this.params = '';
    this.response = '';
    this.url = '';
    this.summary = '';
  }
}

export class TypeDefinition {
  name = '';
  props: any;
}

export interface FileResourceDefine {
  [fileName: string]: {
    // 去拼接service
    methods?: MethodItem[];
    // 去拼接dto和vo
    typeDefinitions?: TypeDefinition[];
  };
}
