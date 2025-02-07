// @ts-nocheck
import fastify from "fastify";
import prisma from "../prisma/prisma";
import { privyClient } from "../utils/privyClient";

const protectedRoutes: fastify.FastifyPluginCallback = (
    instance,
    options,
    done
) => {
    instance.post("/authenticate", async (request, reply) => {
        const { welcomeName }: { welcomeName: string | null } = request.body;

        const user = await prisma.user.update({
            where: {
                id: request.user.id,
            },
            data: {
                welcomeName,
            },
            include: {
                Wallets: true,
            },
        });

        if (user.Wallets.length === 0) {
            // create user wallets
            const { id, address, chainType } =
                await privyClient.walletApi.create({
                    chainType: "ethereum",
                });

            await prisma.wallets.create({
                data: {
                    userId: user.id,
                    walletId: id,
                    address,
                    chainType,
                },
            });
        }

        let userUpdated = await prisma.user.findUnique({
            where: {
                id: request.user.id,
            },
            include: {
                Wallets: true,
            },
        });

        // Only authenticated users will see the following message
        return reply.send({
            status: true,
            response: {
                user: request.user,
            },
        });
    });

    done();
};

const publicRoutes: fastify.FastifyPluginCallback = (
    instance,
    options,
    done
) => {
    done();
};

export { protectedRoutes, publicRoutes };
