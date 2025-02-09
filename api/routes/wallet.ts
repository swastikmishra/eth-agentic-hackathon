// @ts-nocheck
import { FastifyPluginCallback } from "fastify";
import prisma from "../prisma/prisma";
import { generateRandomNickname } from "../utils/nickname";
import { updateWalletBalance, updateWalletSnapshot } from "../utils/balance";

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
                        where: {
                            createdAt: {
                                gte: new Date(
                                    new Date().getTime() -
                                        1000 * 60 * 60 * 24 * 1
                                ), // 1 day
                            },
                        },
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

    instance.get("/refresh", async (request, reply) => {
        try {
            const userWallets = await prisma.wallet.findMany({
                where: {
                    userId: request.user.id,
                },
                select: {
                    id: true,
                },
            });

            for (let wallet of userWallets) {
                await updateWalletSnapshot(wallet.id);
                await updateWalletBalance(wallet.id);
            }

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

    instance.get("/:walletId/transactions", async (request, reply) => {
        try {
            const walletId = parseInt(request.params.walletId);
            const transactions = await prisma.walletTxn.findMany({
                where: {
                    walletId: walletId,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            return reply.send({
                status: true,
                response: transactions,
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
