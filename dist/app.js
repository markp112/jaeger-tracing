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
exports.app = void 0;
const tracing_1 = require("./tracing/tracing");
const tracer = (0, tracing_1.initializeTracing)('node-app', 'development');
const express_1 = __importDefault(require("express"));
const logger_1 = require("./logger/logger");
const client_1 = require("@prisma/client");
const auth_1 = require("./api/auth/auth");
const app = (0, express_1.default)();
exports.app = app;
const prisma = new client_1.PrismaClient({});
app.get('/', (req, res) => {
    logger_1.logger.info('app running');
    res.send('Hello World!');
});
app.use(auth_1.authRouter);
app.get('/users/random', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.info('/users/random - called');
    yield tracer.startActiveSpan('Get /users/random', (requestSpan) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let users = yield prisma.user.findMany({
                include: {
                    posts: true,
                },
            });
            const shuffledUsers = users.sort(() => 0.5 - Math.random());
            const selectedUsers = shuffledUsers.slice(0, 10);
            requestSpan.setAttribute('http.status', 200);
            res.status(200).json(selectedUsers);
        }
        catch (e) {
            requestSpan.setAttribute('http.status', 500);
            res.status(500).json({ error: 500, details: e });
        }
        finally {
            requestSpan.end();
        }
    }));
}));
//# sourceMappingURL=app.js.map