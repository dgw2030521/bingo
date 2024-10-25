import path from 'path';
import fs from 'fs';
import ejs from 'ejs';
import * as SwaggerParser from '@apidevtools/swagger-parser';
import DefinitionsConverter from './DefinitionsConverter';
import { ApiDocTypeDefine } from './types/ApiTypeDefine';
import { each, map } from 'lodash';
import { CommonTypeDefineFileName, PaginationVoName, ResponseVoName } from './config';
import { beautifyText } from './utils';
const SOURCE_DIR = 'tmp';

const init = async () => {
  const apiUrl = 'http://127.0.0.1:4523/export/openapi/3?version=2.0';

  const apiJson: ApiDocTypeDefine = await SwaggerParser.default.parse(apiUrl);

  // 用转换器加载
  const converterIns = new DefinitionsConverter(apiJson);

  each(converterIns.paths, (item, methodPath) => {
    converterIns.genServiceMethodByPath(methodPath);
  });

  //  遍历文件转换对象
  each(converterIns.fileResource, async (item, fileName) => {
    // 方法定义
    if (item.methods) {
      const serviceStr = await ejs.renderFile(path.join(__dirname, './tpls/service.ejs'), {
        fileName,
        methods: item.methods,
        respKey: ResponseVoName,
        paginationKey: PaginationVoName,
        commonFileName: CommonTypeDefineFileName,
        typeNames: map(item.typeDefinitions, (jtem) => {
          return jtem.name;
        }),
      });

      const SERVICES_DIR = path.resolve(process.cwd(), `${SOURCE_DIR}/services`); // 配置文件的services输出目录
      const servicesPath = `${SERVICES_DIR}/${fileName}.ts`;

      const dirPath = path.dirname(servicesPath);
      fs.mkdirSync(dirPath, { recursive: true });
      fs.writeFileSync(servicesPath, beautifyText(serviceStr));
    }

    // 类型定义
    if (item.typeDefinitions) {
      const typeDefinitionsStr = await ejs.renderFile(path.join(__dirname, './tpls/type.ejs'), {
        deps: item.typeDefinitions,
        // 有些类型引用，之前创建过的，直接引用就行，无需再创建
        referenceTypeNames: [],
        referenceFileName: '',
      });
      const TYPES_DIR = path.resolve(process.cwd(), `${SOURCE_DIR}/types`); // 配置文件的services输出目录
      const typesDefinePath = `${TYPES_DIR}/${fileName}.ts`;
      const dirPath = path.dirname(typesDefinePath);
      fs.mkdirSync(dirPath, { recursive: true });

      fs.writeFileSync(typesDefinePath, beautifyText(typeDefinitionsStr));
    }
  });
};

init();
