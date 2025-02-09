// @ts-nocheck
import { FastifyPluginCallback } from "fastify";
import prisma from "../prisma/prisma";
import { generateRandomNickname } from "../utils/nickname";

const protectedRoutes: FastifyPluginCallback = (instance, options, done) => {
    instance.get("/", async (request, reply) => {
        try {
            const traders = await prisma.trader.findMany({
                where: {
                    userId: {
                        in: [0, request.user.id],
                    },
                },
                orderBy: [{ userId: "desc" }, { roi: "desc" }],
            });

            return reply.send({
                status: true,
                response: traders,
            });
        } catch (error) {
            console.error(error);
            return reply.send({
                status: false,
                error,
            });
        }
    });

    instance.get("/info", async (request, reply) => {
        try {
            const maxUpdatedAt = await prisma.trader.findMany({
                where: {
                    userId: {
                        in: [0],
                    },
                },
                orderBy: {
                    updatedAt: "desc",
                },
                select: {
                    updatedAt: true,
                },
                take: 1,
            });

            return reply.send({
                status: true,
                response: {
                    ...maxUpdatedAt[0],
                },
            });
        } catch (error) {
            console.error(error);
            return reply.send({
                status: false,
                error,
            });
        }
    });

    instance.post("/save", async (request, reply) => {
        try {
            const walletAddress = request.body.walletAddress;
            let nickname = null;
            let isNicknameTaken = true;

            while (isNicknameTaken) {
                // Check if the nickname is already taken
                nickname = generateRandomNickname();
                let existingNickname = await prisma.trader.findFirst({
                    where: {
                        nickname,
                    },
                });
                if (!existingNickname) isNicknameTaken = false;
            }

            await prisma.trader.create({
                data: {
                    userId: request.user.id,
                    visible: true,
                    disabled: false,
                    walletAddress: walletAddress,
                    nickname: nickname,
                },
            });

            return reply.send({
                status: true,
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
