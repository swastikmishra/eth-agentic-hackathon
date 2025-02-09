import {
    AgentStatus,
    Wallet,
    WalletTxn,
    WalletTxnCategory,
    WalletTxnStatus,
    WalletType,
} from "@prisma/client";
import prisma from "../prisma/prisma";
import delay from "./delay";
import { getTransactionStatus } from "./lifiClient";
import { updateWalletBalance, updateWalletSnapshot } from "./balance";

const checkTransactionStatus = async (txn: WalletTxn) => {
    if (!txn.txnHash) {
        return;
    }
    const status = await getTransactionStatus(txn.txnHash);

    if (status == "DONE") {
        await prisma.walletTxn.update({
            where: {
                id: txn.id,
            },
            data: {
                status: WalletTxnStatus.SUCCESS,
            },
        });
    } else if (status == "FAILED") {
        await prisma.walletTxn.update({
            where: {
                id: txn.id,
            },
            data: {
                status: WalletTxnStatus.FAILED,
            },
        });
    }

    if (status != "DONE") {
        return;
    }

    //update the source wallet balances
    await updateWalletSnapshot(txn.walletId);
    await updateWalletBalance(txn.walletId);

    if (txn.toWalletId) {
        const toWallet = await prisma.wallet.findUnique({
            where: {
                id: txn.toWalletId,
            },
        });

        if (!toWallet) {
            return;
        }

        await updateWalletSnapshot(txn.toWalletId);
        await updateWalletBalance(txn.toWalletId);

        await updateAgentStatus(txn, toWallet);
    }
};

const checkAllPendingTransactions = async () => {
    const txns = await prisma.walletTxn.findMany({
        where: {
            // status: WalletTxnStatus.PENDING,
        },
    });

    for (let txn of txns) {
        if (txn.txnHash) {
            try {
                await checkTransactionStatus(txn);
            } catch (e) {}
            await delay(5);
        }
    }
};

const updateAgentStatus = async (txn: WalletTxn, wallet: Wallet) => {
    if (wallet.type !== WalletType.AGENT) {
        console.error("Wallet is not an agent wallet");
        return;
    }

    const agent = await prisma.agent.findUnique({
        where: {
            id: wallet.agentId as number,
        },
    });

    if (!agent) {
        console.error("not an agent wallet");
        return;
    }

    const time = new Date();
    const logs = agent.logs;

    if (txn.status == WalletTxnStatus.FAILED) {
        logs.push(
            `${time.toLocaleString()}: Agent failed to receive ${txn.amount}`
        );
        logs.push(
            `${time.toLocaleString()}: Agent is now back to CREATED status`
        );

        await prisma.agent.update({
            where: {
                id: wallet.agentId as number,
            },
            data: {
                status: AgentStatus.RUNNING,
                logs: logs,
            },
        });
    } else if (txn.status == WalletTxnStatus.SUCCESS) {
        logs.push(`${time.toLocaleString()}: Agent received ${txn.amount}`);
        logs.push(`${time.toLocaleString()}: Agent is now running`);

        await prisma.agent.update({
            where: {
                id: wallet.agentId as number,
            },
            data: {
                status: AgentStatus.RUNNING,
                logs: logs,
            },
        });

        await prisma.walletTxn.create({
            data: {
                walletId: wallet.id,
                txnOwner: WalletType.AGENT,
                category: WalletTxnCategory.INTERNAL_TRANSFER,
                description: `Received ${txn.amount} from user wallet`,
                tokenAddress: txn.tokenAddress,
                amount: txn.amount,
                decimals: txn.decimals,
                status: WalletTxnStatus.SUCCESS,
                txnHash: txn.txnHash,
            },
        });
    }
};

export { checkAllPendingTransactions, checkTransactionStatus };
