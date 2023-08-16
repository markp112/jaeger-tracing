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
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const logger_1 = require("../../logger/logger");
const auth_repository_1 = require("../../core/repository/auth/auth.repository");
const auth_service_1 = require("../../core/service/auth/auth.service");
const config_1 = require("../../config/config");
const authRouter = express_1.default.Router();
exports.authRouter = authRouter;
const ROUTE_PATH = '/auth';
const getPath = (pathToAppend) => `${ROUTE_PATH}/${pathToAppend}`;
authRouter.post(getPath('login'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bodyData = req.body;
    const baseUrl = new config_1.Config.AuthUrl().getUrl();
    if (!bodyData) {
        logger_1.logger.error('invalid credentials - Missing');
        res.status(400).send('mssing credentials');
    }
    if (bodyData.userName) {
        const credentials = bodyData;
        const authService = new auth_service_1.AuthService(new auth_repository_1.AuthRepository(baseUrl));
        const loggedIn = yield authService.login(credentials);
        res.status(200).send(loggedIn);
    }
}));
//# sourceMappingURL=auth.js.map