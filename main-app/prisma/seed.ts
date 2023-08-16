import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from 'uuid';


const prisma = new PrismaClient();


const random = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

async function main() {
    await prisma.post.deleteMany({})
    await prisma.user.deleteMany({})

    // Create 25 users
    for (let i = 0; i < 25; i++) {
        const posts = [];
        // Every user has between 0 and 10 posts
        for (let k = 0; k < 10; k++) {
            posts.push({
                id: uuid(),
                description: random(11111, 99999).toString(),
            });
        }
        // create user with posts
        await prisma.user.create({
            data: {
                id: `user-${i}`,
                name: random(11111, 99999).toString(),
                posts: {
                    create: posts,
                },
            },
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
