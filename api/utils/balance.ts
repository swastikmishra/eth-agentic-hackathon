import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import prisma from "../prisma/prisma";
import delay from "./delay";

Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
});

const updateWalletBalance = async (walletId: number) => {
    const wallet = await prisma.wallet.findUnique({
        where: {
            id: walletId,
        },
    });

    if (!wallet) {
        console.error(`Wallet with id ${walletId} not found`);
        return;
    }

    const response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
        chain: EvmChain.BASE,
        excludeSpam: true,
        excludeUnverifiedContracts: false,
        address: wallet.address,
        limit: 100,
    });

    let balances = response.result;
    if (balances.length === 0) {
        console.error(`Balance empty for wallet ${wallet.address}`);
        return;
    }

    for (let balance of balances) {
        try {
            let balance_json = balance.toJSON();

            let balance_data = {
                symbol:
                    balance_json.symbol != null
                        ? balance_json.symbol.toString()
                        : null,
                name:
                    balance_json.name != null
                        ? balance_json.name.toString()
                        : null,
                logo:
                    balance_json.logo != null
                        ? balance_json.logo.toString()
                        : null,
                thumbnail:
                    balance_json.thumbnail != null
                        ? balance_json.thumbnail.toString()
                        : null,
                decimals:
                    balance_json.decimals != null
                        ? balance_json.decimals.toString()
                        : null,
                balance:
                    balance_json.balance != null
                        ? balance_json.balance.toString()
                        : null,
                possibleSpam:
                    balance_json.possible_spam != null
                        ? balance_json.possible_spam
                        : null,
                verifiedContract:
                    balance_json.verified_contract != null
                        ? balance_json.verified_contract
                        : null,
                balanceFormatted:
                    balance_json.balance_formatted != null
                        ? balance_json.balance_formatted.toString()
                        : null,
                usdPrice:
                    balance_json.usd_price != null
                        ? parseFloat(balance_json.usd_price).toString()
                        : null,
                usdPrice24hrPercentChange:
                    balance_json.usd_price_24hr_percent_change != null
                        ? balance_json.usd_price_24hr_percent_change.toString()
                        : null,
                usdPrice24hrUsdChange:
                    balance_json.usd_price_24hr_usd_change != null
                        ? balance_json.usd_price_24hr_usd_change.toString()
                        : null,
                usdValue:
                    balance_json.usd_value != null
                        ? balance_json.usd_value.toString()
                        : null,
                usdValue24hrUsdChange:
                    balance_json.usd_value_24hr_usd_change != null
                        ? balance_json.usd_value_24hr_usd_change.toString()
                        : null,
                nativeToken:
                    balance_json.native_token != null
                        ? balance_json.native_token
                        : null,
            };

            await prisma.walletBalance.upsert({
                where: {
                    walletId_tokenAddress: {
                        walletId: wallet.id,
                        tokenAddress: balance.tokenAddress?.toJSON() as string,
                    },
                },
                create: {
                    walletId: wallet.id,
                    tokenAddress: balance.tokenAddress?.toJSON() as string,
                    ...balance_data,
                },
                update: {
                    ...balance_data,
                },
            });
        } catch (err) {
            console.error(err);
        }
    }

    return true;
};

const updateWalletSnapshot = async (walletId: number) => {
    const wallet = await prisma.wallet.findUnique({
        where: {
            id: walletId,
        },
    });

    if (!wallet) {
        console.error(`Wallet with id ${walletId} not found`);
        return;
    }

    const response = await Moralis.EvmApi.wallets.getWalletNetWorth({
        chains: [EvmChain.BASE],
        excludeSpam: true,
        excludeUnverifiedContracts: false,
        address: wallet.address,
    });

    let wealth = response.toJSON().chains[0];
    if (!wealth) {
        console.error(`Wealth is empty for wallet ${wallet.address}`);
        return;
    }

    const balance_data = {
        native_balance: parseInt(wealth.native_balance),
        native_balance_formatted: parseFloat(wealth.native_balance_formatted),
        native_balance_usd: parseFloat(wealth.native_balance_usd),
        token_balance_usd: parseFloat(wealth.token_balance_usd),
        networth_usd: parseFloat(wealth.networth_usd),
    };

    await prisma.walletSnapshot.create({
        data: {
            walletId: walletId,
            ...balance_data,
        },
    });

    return true;
};

const updateAllWalletSnapshot = async () => {
    const wallets = await prisma.wallet.findMany();

    for (const wallet of wallets) {
        await updateWalletSnapshot(wallet.id);
        await delay();
    }
};
const updateAllWalletBalances = async () => {
    const wallets = await prisma.wallet.findMany();

    for (const wallet of wallets) {
        await updateWalletBalance(wallet.id);
        await delay();
    }
};
