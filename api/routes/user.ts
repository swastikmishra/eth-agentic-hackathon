// @ts-nocheck
import fastify from "fastify";
import prisma from "../prisma/prisma";
import { privyClient } from "../utils/privyClient";
import { WalletType } from "@prisma/client";
import { generateRandomNickname } from "../utils/nickname";

const protectedRoutes: fastify.FastifyPluginCallback = (
    instance,
    options,
    done
) => {
    instance.post("/authenticate", async (request, reply) => {
        try {
            let { name }: { name: string | null } = request.body;

            if (name == "") name = generateRandomNickname();

            const user = await prisma.user.update({
                where: {
                    id: request.user.id,
                },
                data: {
                    name,
                },
                include: {
                    Wallet: true,
                },
            });

            if (user.Wallet.length === 0) {
                // create user wallets
                const { id, address, chainType } =
                    await privyClient.walletApi.create({
                        chainType: "ethereum",
                    });

                await prisma.wallet.create({
                    data: {
                        userId: user.id,
                        walletId: id,
                        address,
                        chainType,
                        type: WalletType.USER,
                    },
                });
            }

            let userUpdated = await prisma.user.findUnique({
                where: {
                    id: request.user.id,
                },
                include: {
                    Wallet: true,
                },
            });

            return reply.send({
                status: true,
                response: {
                    user: request.user,
                },
            });
        } catch (err) {
            console.error(err);
            return reply.send({
                status: false,
                error: err,
            });
        }
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
