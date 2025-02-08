import prisma from "../prisma/prisma";

interface ApiTrader {
    platformId: number;
    platformCryptoId: number;
    traderAddress: string;
    tokenSymbol: string;
    tokenName: string;
    tokenAddress: string;
    tokenCryptoId: string;
    realizeProfit: number;
    unrealizeProfit: number;
    totalProfit: number;
    roi: number;
    totalTrades: number;
    totalBuy: number;
    totalSell: number;
    numDays: number;
    addressFormatUrl: string;
    createDate: string;
    tradeDate: string;
    lastTradeDate: string;
}

interface TraderApiResponse {
    data: ApiTrader[];
    status: {
        timestamp: string;
        error_code: string;
        error_message: string;
        elapsed: string;
        credit_count: number;
    };
}

const API_URL =
    "https://api.coinmarketcap.com/dexer/v3/dexer/top-trader?topRanked=false&platformId=1&sortBy=realizeProfit&sortDirection=DESC&period=7d";

/**
 * Fetch traders from the API endpoint.
 */
async function fetchTraders(): Promise<ApiTrader[]> {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const data: TraderApiResponse =
            (await response.json()) as TraderApiResponse;
        console.log(`Fetched ${data.data.length} traders from API.`);
        return data.data;
    } catch (error) {
        console.error("Error fetching traders from API:", error);
        return [];
    }
}

async function upsertTrader(apiTrader: ApiTrader): Promise<void> {
    // Determine the disabled flag based on ROI (less than 50%).
    const disabled = apiTrader.roi < 0.5;

    const tradingData = {
        realizeProfit: apiTrader.realizeProfit,
        unrealizeProfit: apiTrader.unrealizeProfit,
        totalProfit: apiTrader.totalProfit,
        roi: apiTrader.roi,
        totalTrades: apiTrader.totalTrades,
        totalBuy: apiTrader.totalBuy,
        totalSell: apiTrader.totalSell,
    };

    try {
        await prisma.trader.upsert({
            where: { walletAddress: apiTrader.traderAddress },
            update: {
                disabled,
                ...tradingData,
            },
            create: {
                walletAddress: apiTrader.traderAddress,
                disabled,
                visible: true, // Default value, but specified here for clarity.
                ...tradingData,
            },
        });
        console.log(
            `Upserted trader with walletAddress: ${apiTrader.traderAddress}`
        );
    } catch (error) {
        console.error(
            `Error upserting trader with walletAddress ${apiTrader.traderAddress}:`,
            error
        );
    }
}

async function main() {
    const traders = await fetchTraders();

    for (const trader of traders) {
        if (!trader.traderAddress) {
            console.warn("Skipping trader with missing traderAddress.");
            continue;
        }
        await upsertTrader(trader);
    }
}

main().catch((error) => {
    console.error("Error in main execution:", error);
    process.exit(1);
});
