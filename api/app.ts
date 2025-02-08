import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import cors from "@fastify/cors";

import { verifyAuthToken } from "./middleware/auth";
import {
    publicRoutes as healthPublicRoutes,
    protectedRoutes as healthProtectedRoutes,
} from "./routes/health";

import { protectedRoutes as userProtectedRoutes } from "./routes/user";
import { protectedRoutes as traderProtectedRoutes } from "./routes/trader";

import prisma from "./prisma/prisma";

const app = fastify({ logger: true });

app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET as string,
});
app.register(cors, {
    origin: process.env.APP_ENDPOINT as string,
});

app.register((instance, opts, next) => {
    instance.addHook("onRequest", verifyAuthToken);

    // all the routes go here
    instance.register(healthProtectedRoutes, { prefix: "/api/v1/health" });
    instance.register(userProtectedRoutes, { prefix: "/api/v1/user" });
    instance.register(traderProtectedRoutes, { prefix: "/api/v1/trader" });
    next();
});

//put all the public routes inside this
app.register((instance, opts, next) => {
    instance.register(healthPublicRoutes, { prefix: "/api/v1/health" });
    next();
});

async function start() {
    await prisma.user.upsert({
        where: {
            id: 0,
        },
        update: {},
        create: {
            id: 0,
            cuid: "0000000000000",
            privyId: "0000000000000",
            welcomeName: "AppOwner",
        },
    });
}
start();

export default app;
