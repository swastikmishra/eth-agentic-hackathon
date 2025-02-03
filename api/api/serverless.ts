import { FastifyRequest } from "fastify/types/request";
import app from "../app";
import { FastifyReply } from "fastify/types/reply";

export default async function handler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    await app.ready();
    app.server.emit("request", request, reply);
}
