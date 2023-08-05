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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.post.deleteMany({});
        yield prisma.user.deleteMany({});
        // Create 25 users
        for (let i = 0; i < 25; i++) {
            const posts = [];
            // Every user has between 0 and 10 posts
            for (let k = 0; k < 10; k++) {
                posts.push({
                    id: (0, uuid_1.v4)(),
                    description: random(11111, 99999).toString(),
                });
            }
            // create user with posts
            yield prisma.user.create({
                data: {
                    id: `user-${i}`,
                    name: random(11111, 99999).toString(),
                    posts: {
                        create: posts,
                    },
                },
            });
        }
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
//# sourceMappingURL=seed.js.map