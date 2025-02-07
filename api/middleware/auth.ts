import { FastifyReply } from "fastify/types/reply";
import { FastifyRequest } from "fastify/types/request";
import prisma from "../prisma/prisma";
import { privyClient } from "../utils/privyClient";

const verifyAuthToken = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    try {
        const token = request.headers.authorization?.split(" ")[1];

        if (!token) {
            throw new Error("Token not found");
        }

        const verifiedClaims = await privyClient.verifyAuthToken(token);

        if (verifiedClaims.userId) {
            Object.assign(request, { user: verifiedClaims.userId });
        } else {
            throw new Error("Invalid user");
        }

        const user = await prisma.user.upsert({
            where: {
                privyId: verifiedClaims.userId,
            },
            create: {
                privyId: verifiedClaims.userId,
            },
            update: {},
            include: {
                Wallets: true,
            },
        });

        Object.assign(request, { user: user });
    } catch (err) {
        console.error(err);
        return reply.status(401).send({ status: false, error: err });
    }
};

export { verifyAuthToken };
