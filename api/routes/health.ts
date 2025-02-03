// @ts-nocheck
import { FastifyPluginCallback } from "fastify";

const protectedRoutes: FastifyPluginCallback = (instance, options, done) => {
    instance.get("/protected", async (request, reply) => {
        // Only authenticated users will see the following message
        return reply.send({
            status: true,
            response: {
                message: "This is a protected route.",
                timestamp: new Date().toISOString(),
            },
        });
    });

    done();
};

const publicRoutes: FastifyPluginCallback = (instance, options, done) => {
    instance.get("/", async (request, reply) => {
        return reply.send({
            status: true,
            response: {
                message: "This is a public route.",
                timestamp: new Date().toISOString(),
            },
        });
    });

    done();
};

export { protectedRoutes, publicRoutes };
