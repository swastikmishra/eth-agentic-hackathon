import { PrismaClient } from "@prisma/client";

declare global {
    interface BigInt {
        toJSON(): string;
    }
}

BigInt.prototype.toJSON = function () {
    return this.toString();
};

const prisma = new PrismaClient();

export default prisma;
