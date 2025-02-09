import { CHAIN_ID, USDC_CONTRACT_ADDRESS } from "../utils/balance";
import { getUSDCTransferQuote } from "../utils/lifiClient";
import { privyClient } from "../utils/privyClient";

const transfer = async () => {
    const fromAddress = "0x5f542C078D95aC06D5991a9736A498D99ADF34A6 ";
    const toAddress = "0xBCa252CFFdfDc0F52fF235c6c3C2239ce28EC2Ac";
    const fromWalletId = "d5e9pmhcxgkot6j2mkwml9b3";

    //transfer funds from user wallet to agent wallet
    const txRequest = getUSDCTransferQuote(fromAddress, toAddress, 5);

    const { hash } = await privyClient.walletApi.ethereum.sendTransaction({
        walletId: fromWalletId,
        caip2: `eip155:${CHAIN_ID.base}`,
        transaction: {
            to: USDC_CONTRACT_ADDRESS.base,
            data: txRequest,
            value: "0x000000",
        },
    });
};

transfer();
