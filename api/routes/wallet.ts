// @ts-nocheck
import { FastifyPluginCallback } from "fastify";
import prisma from "../prisma/prisma";
import { generateRandomNickname } from "../utils/nickname";

const protectedRoutes: FastifyPluginCallback = (instance, options, done) => {
    instance.get("/", async (request, reply) => {
        try {
            const wallets = await prisma.wallet.findMany({
                where: {
                    userId: request.user.id,
                },
                include: {
                    WalletBalance: true,
                    WalletSnapshot: {
                        orderBy: {
                            createdAt: "desc",
                        },
                        take: 1,
                    },
                },
            });

            return reply.send({
                status: true,
                response: wallets,
            });
        } catch (error) {
            console.error(error);
            return reply.send({
                status: false,
                error,
            });
        }
    });

    instance.post("/:id", async (request, reply) => {
        try {
            return reply.send({
                status: true,
                response: {},
            });
        } catch (error) {
            console.error(error);
            return reply.send({
                status: false,
                error,
            });
        }
    });

    done();
};

const publicRoutes: FastifyPluginCallback = (instance, options, done) => {
    done();
};

export { protectedRoutes, publicRoutes };
