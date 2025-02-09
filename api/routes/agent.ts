// @ts-nocheck
import { FastifyPluginCallback } from "fastify";
import prisma from "../prisma/prisma";
import { generateRandomNickname } from "../utils/nickname";
import {
    USDC_CONTRACT_ADDRESS,
    CHAIN_ID,
    updateWalletBalance,
    updateWalletSnapshot,
} from "../utils/balance";
import {
    AgentStatus,
    WalletTxnCategory,
    WalletTxnStatus,
    WalletType,
} from "@prisma/client";
import { privyClient } from "../utils/privyClient";
import { getUSDCTransferQuote } from "../utils/lifiClient";
import { ethers } from "ethers";

const protectedRoutes: FastifyPluginCallback = (instance, options, done) => {
    instance.post("/", async (request, reply) => {
        try {
            const { traderId, intitalDeposit, tradeAllocationPercentage } =
                request.body;

            const user = request.user;

            if (parseInt(intitalDeposit) < 5) {
                throw new Error("Initial deposit must be at least 5 USDC");
            }

            if (parseInt(tradeAllocationPercentage) < 10) {
                throw new Error(
                    "Trade allocation percentage must be at least 10"
                );
            }

            // Check if the trader exists and retrieve USDC balance
            const trader = await prisma.trader.findUnique({
                where: { id: traderId },
            });

            if (!trader) {
                throw new Error("Trader not found");
            }

            const wallet = await prisma.wallet.findFirst({
                where: {
                    userId: user.id,
                    type: WalletType.USER,
                },
                include: {
                    WalletBalance: {
                        where: {
                            tokenAddress: {
                                equals: USDC_CONTRACT_ADDRESS.base,
                                mode: "insensitive",
                            },
                        },
                    },
                },
            });

            console.dir(wallet, { depth: null });

            if (!wallet) {
                throw new Error("User wallet not found");
            }

            if (wallet.WalletBalance.length === 0) {
                throw new Error("You don't have enough USDC balance");
            }

            if (
                parseFloat(wallet.WalletBalance[0].balanceFormatted) <
                intitalDeposit
            ) {
                throw new Error("Insufficient USDC balance");
            }

            const timeNow = new Date();

            let nickname = null;
            let isNicknameTaken = true;

            while (isNicknameTaken) {
                // Check if the nickname is already taken
                nickname = generateRandomNickname();
                let existingNickname = await prisma.agent.findFirst({
                    where: {
                        nickname,
                    },
                });
                if (!existingNickname) isNicknameTaken = false;
            }

            //create the agent first
            const agent = await prisma.agent.create({
                data: {
                    userId: user.id,
                    initialDeposit: parseInt(intitalDeposit),
                    tradeAllocationPercentage: parseInt(
                        tradeAllocationPercentage
                    ),
                    traderId: trader.id,
                    logs: [`${timeNow.toLocaleString()}: Agent created`],
                    nickname: nickname,
                    status: AgentStatus.CREATED,
                },
            });

            if (!agent) {
                throw new Error("Failed to create agent");
            }

            //create the agent wallet first
            const { id, address, chainType } =
                await privyClient.walletApi.create({
                    chainType: "ethereum",
                });

            const agentWallet = await prisma.wallet.create({
                data: {
                    userId: user.id,
                    walletId: id,
                    address,
                    chainType: "ethereum",
                    type: WalletType.AGENT,
                    agentId: agent.id,
                },
            });

            await updateWalletBalance(agentWallet.id);
            await updateWalletSnapshot(agentWallet.id);

            if (!agentWallet) {
                throw new Error("Failed to create agent wallet");
            }

            return reply.send({
                status: true,
                response: agent,
            });
        } catch (error) {
            console.error(error);
            return reply.send({
                status: false,
                error: error,
            });
        }
    });

    instance.get("/", async (request, reply) => {
        try {
            const user = request.user;

            const agents = await prisma.agent.findMany({
                where: {
                    userId: user.id,
                },
                include: {
                    Wallet: {
                        include: {
                            WalletBalance: true,
                        },
                    },
                    Trader: true,
                },
            });

            return reply.send({
                status: true,
                response: agents,
            });
        } catch (error) {
            console.error(error);
            return reply.send({
                status: false,
                error,
            });
        }
    });

    instance.get("/initiate/:agentId", async (request, reply) => {
        try {
            const agentId = parseInt(request.params.agentId);

            const user = request.user;
            const agent = await prisma.agent.findUnique({
                where: {
                    id: agentId,
                },
            });
            if (!agent) {
                throw new Error("Agent not found");
            }

            const userWallet = await prisma.wallet.findFirst({
                where: {
                    userId: user.id,
                    type: WalletType.USER,
                },
                include: {
                    WalletBalance: {
                        where: {
                            tokenAddress: {
                                equals: USDC_CONTRACT_ADDRESS.base,
                                mode: "insensitive",
                            },
                        },
                    },
                },
            });

            if (!userWallet) {
                7;
                throw new Error("User wallet not found");
            }

            if (
                parseFloat(userWallet.WalletBalance[0].balanceFormatted) <
                agent.initialDeposit
            ) {
                throw new Error("Insufficient USDC balance");
            }

            const agentWallet = await prisma.wallet.findFirst({
                where: {
                    userId: user.id,
                    type: WalletType.AGENT,
                    agentId: agentId,
                },
            });

            if (!agentWallet) {
                throw new Error("Agent wallet not found");
            }

            const timeNow = new Date();

            //transfer funds from user wallet to agent wallet
            const txRequest = getUSDCTransferQuote(
                userWallet.address,
                agentWallet.address,
                agent.initialDeposit
            );

            const { hash } =
                await privyClient.walletApi.ethereum.sendTransaction({
                    walletId: userWallet.walletId,
                    caip2: `eip155:${CHAIN_ID.base}`,
                    transaction: {
                        to: USDC_CONTRACT_ADDRESS.base,
                        data: txRequest,
                        value: "0x000000",
                    },
                });

            await prisma.walletTxn.create({
                data: {
                    walletId: userWallet.id,
                    txnHash: hash,
                    amount: agent.initialDeposit,
                    txnOwner: WalletType.USER,
                    category: WalletTxnCategory.INTERNAL_TRANSFER,
                    description: `Transfer to agent wallet ${agentWallet.address}`,
                    status: WalletTxnStatus.PENDING,
                    tokenAddress: USDC_CONTRACT_ADDRESS.base,
                    decimals: 6,
                    toWalletId: agentWallet.id,
                },
            });

            await prisma.agent.update({
                where: {
                    id: agentId,
                },
                data: {
                    status: AgentStatus.WAITING,
                    logs: [
                        ...agent.logs,
                        `${timeNow.toLocaleString()}: Agent status changed to Waiting...`,
                        `${timeNow.toLocaleString()}: Agent waiting for USDC deposit...`,
                    ],
                },
            });

            return reply.send({
                status: true,
                response: {},
            });
        } catch (error) {
            console.error(error);
            return reply.send({
                status: false,
                error: error,
            });
        }
    });

    done();
};

const publicRoutes: FastifyPluginCallback = (instance, options, done) => {
    done();
};

export { protectedRoutes, publicRoutes };
