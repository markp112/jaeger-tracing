"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
var Config;
(function (Config) {
    class AuthUrl {
        getUrl() {
            const url = process.env.AUTH_URL || 'http://localhost:3010';
            return url;
        }
    }
    Config.AuthUrl = AuthUrl;
})(Config || (exports.Config = Config = {}));
//# sourceMappingURL=config.js.map