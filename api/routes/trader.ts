// @ts-nocheck
import { FastifyPluginCallback } from "fastify";
import prisma from "../prisma/prisma";

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

            await prisma.trader.create({
                data: {
                    userId: request.user.id,
                    visible: true,
                    disabled: false,
                    walletAddress: walletAddress,
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
