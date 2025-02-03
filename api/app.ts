import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import cors from "@fastify/cors";

import {
    publicRoutes as healthPublicRoutes,
    protectedRoutes as healthProtectedRoutes,
} from "./routes/health";

const app = fastify({ logger: true });

app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET as string,
});
app.register(cors, {
    origin: process.env.APP_ENDPOINT as string,
});

app.register((instance, opts, next) => {
    instance.addHook("onRequest", async (request, reply) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });
    // all the routes go here
    instance.register(healthProtectedRoutes, { prefix: "/api/v1/health" });
    next();
});

//put all the public routes inside this
app.register((instance, opts, next) => {
    instance.register(healthPublicRoutes, { prefix: "/api/v1/health" });
    next();
});

export default app;
