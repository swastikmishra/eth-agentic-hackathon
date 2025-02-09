import { checkAllPendingTransactions } from "../utils/transaction";

const test = async () => {
    await checkAllPendingTransactions();
};

test();
