"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ejs_1 = __importDefault(require("ejs"));
const SwaggerParser = __importStar(require("@apidevtools/swagger-parser"));
const DefinitionsConverter_1 = __importDefault(require("./DefinitionsConverter"));
const lodash_1 = require("lodash");
const config_1 = require("./config");
const utils_1 = require("./utils");
const SOURCE_DIR = 'tmp';
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    const apiUrl = 'http://127.0.0.1:4523/export/openapi/2?version=3.0';
    const apiJson = yield SwaggerParser.default.parse(apiUrl);
    // 用转换器加载
    const converterIns = new DefinitionsConverter_1.default(apiJson);
    (0, lodash_1.each)(converterIns.paths, (item, methodPath) => {
        converterIns.genServiceMethodByPath(methodPath);
    });
    //  遍历文件转换对象
    (0, lodash_1.each)(converterIns.fileResource, (item, fileName) => __awaiter(void 0, void 0, void 0, function* () {
        // 方法定义
        if (item.methods) {
            const serviceStr = yield ejs_1.default.renderFile(path_1.default.join(__dirname, './tpls/service.ejs'), {
                fileName,
                methods: item.methods,
                respKey: config_1.ResponseVoName,
                paginationKey: config_1.PaginationVoName,
                commonFileName: config_1.CommonTypeDefineFileName,
                typeNames: (0, lodash_1.map)(item.typeDefinitions, (jtem) => {
                    return jtem.name;
                }),
            });
            const SERVICES_DIR = path_1.default.resolve(process.cwd(), `${SOURCE_DIR}/services`); // 配置文件的services输出目录
            const servicesPath = `${SERVICES_DIR}/${fileName}.ts`;
            const dirPath = path_1.default.dirname(servicesPath);
            fs_1.default.mkdirSync(dirPath, { recursive: true });
            fs_1.default.writeFileSync(servicesPath, (0, utils_1.beautifyText)(serviceStr));
        }
        // 类型定义
        if (item.typeDefinitions) {
            const typeDefinitionsStr = yield ejs_1.default.renderFile(path_1.default.join(__dirname, './tpls/type.ejs'), {
                deps: item.typeDefinitions,
                // 有些类型引用，之前创建过的，直接引用就行，无需再创建
                referenceTypeNames: [],
                referenceFileName: '',
            });
            const TYPES_DIR = path_1.default.resolve(process.cwd(), `${SOURCE_DIR}/types`); // 配置文件的services输出目录
            const typesDefinePath = `${TYPES_DIR}/${fileName}.ts`;
            const dirPath = path_1.default.dirname(typesDefinePath);
            fs_1.default.mkdirSync(dirPath, { recursive: true });
            fs_1.default.writeFileSync(typesDefinePath, (0, utils_1.beautifyText)(typeDefinitionsStr));
        }
    }));
});
init();
