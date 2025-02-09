import { ChainId, getQuote, createConfig, getStatus } from "@lifi/sdk";
import { CHAIN_ID, USDC_CONTRACT_ADDRESS } from "./balance";
import { ethers } from "ethers";

import ERC20_ABI from "./erc20.abi.json";

createConfig({
    integrator: "eth-hackathon-app",
});

const getUSDCTransferQuote = (
    fromAddress: string,
    toAddress: string,
    amount: number
) => {
    let transferAmount = amount * 10 ** 6;

    const contract = new ethers.Contract(USDC_CONTRACT_ADDRESS.base, ERC20_ABI);
    const transactionRequest = contract.interface.encodeFunctionData(
        "transfer",
        [toAddress, transferAmount]
    );

    return transactionRequest;
};

const getTransactionStatus = async (txHash: string) => {
    interface EtherscanApiResponse {
        status: string;
        message: string;
        result: {
            status: string;
        };
    }

    const response = await fetch(
        `https://api.basescan.org/api?module=transaction&action=gettxreceiptstatus&txhash=${txHash}&apikey=${process.env.ETHERSCAN_API_KEY}`
    );

    if (!response.ok) {
        return "PENDING";
    }

    const status: EtherscanApiResponse =
        (await response.json()) as EtherscanApiResponse;

    if (status.status == "0") {
        return "FAILED";
    } else if (status.status == "1") {
        return "DONE";
    } else {
        return "PENDING";
    }
};

export { getUSDCTransferQuote, getTransactionStatus };
