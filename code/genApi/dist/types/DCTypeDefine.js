"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeDefinition = exports.MethodItem = void 0;
class MethodItem {
    constructor() {
        this.name = '';
        this.type = '';
        this.params = '';
        this.response = '';
        this.url = '';
        this.summary = '';
    }
}
exports.MethodItem = MethodItem;
class TypeDefinition {
    constructor() {
        this.name = '';
    }
}
exports.TypeDefinition = TypeDefinition;
