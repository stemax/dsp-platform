import {PrismaClient} from '@prisma/client';
import bcrypt from "bcrypt";
import dotenv from "dotenv";


const prisma = new PrismaClient();

async function seed() {

    const configuration = dotenv.config({path: '.env'})?.parsed;

    const adminRole = await prisma.roles.upsert(
        {
            where: {name: "administrator"},
            update: {},
            create: {
                name: 'administrator',
            }
        });


    const user = await prisma.users.upsert(
        {
            where: {email: "admin@admin.com"},
            update: {},
            create: {
                email: configuration?.DEFAULT_ADMIN_EMAIL || "admin@admin.com",
                password: await bcrypt.hash(configuration?.DEFAULT_ADMIN_PASSWORD || "password", 10)
            }
        });

    if (adminRole && user) {
        await prisma.usersOnRoles.upsert(
            {
                where: {
                    userId: user.id,
                    roleId: adminRole.id,
                    userId_roleId: {userId: user.id, roleId: adminRole.id}
                },
                update: {},
                create: {
                    userId: user.id,
                    roleId: adminRole.id,
                    assignedBy: "system"
                }
            });
    }

    await prisma.roles.upsert(
        {
            where: {name: "moderator"},
            update: {},
            create: {
                name: 'moderator',
            }
        });

    await prisma.roles.upsert(
        {
            where: {name: "client"},
            update: {},
            create: {
                name: 'client',
            }
        });

    await prisma.bidSettings.upsert(
        {
            where: {geo: "US"},
            update: {},
            create: {
                geo: 'US',
                category: 'IAB12',
                baseCpm: 2.0,
                multiplier: 1.5,
            }
        });

    console.log('Seed data successfully added.');
}

seed()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });