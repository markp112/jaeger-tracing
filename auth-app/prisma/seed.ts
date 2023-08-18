import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from 'uuid';

const prisma = new PrismaClient();

async function main() {
    await prisma.user.deleteMany({})
    await prisma.user.create({
        data: {
                id: uuid(),
                username: 'fred',
        },
    });
    await prisma.user.create({
        data: {
                id: uuid(),
                username: 'test',
        },
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });