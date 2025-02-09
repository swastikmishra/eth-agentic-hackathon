import {
    updateAllWalletBalances,
    updateAllWalletSnapshot,
} from "../utils/balance";

const test = async () => {
    updateAllWalletSnapshot();
    updateAllWalletBalances();
};

test();
