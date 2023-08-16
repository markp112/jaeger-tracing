"use strict";
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
exports.AuthRepository = void 0;
const logger_1 = require("../../../logger/logger");
const axios_1 = __importDefault(require("axios"));
class AuthRepository {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    ;
    login(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(credentials);
            const result = yield axios_1.default.post(`${this.baseUrl}/auth/login`, credentials);
            console.log('%c⧭', 'color: #ff0000', result);
            return true;
        });
    }
}
exports.AuthRepository = AuthRepository;
//# sourceMappingURL=auth.repository.js.map