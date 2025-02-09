import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import WalletAddress from "./WalletAddress";
import { Button } from "../ui/button";
import { Coins, List } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

export interface IWallet {
    id: number;
    cuid: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    type: string; // e.g. "AGENT" or "USER"
    walletId: string;
    address: string;
    chainType: string;
    userId: number;
    agentId: number | null;
    WalletBalance: IWalletBalance[];
    WalletSnapshot: IWalletSnapshot[];
}

export interface IWalletBalance {
    id: number;
    walletId: number;
    tokenAddress: string;
    symbol: string;
    name: string;
    logo: string | null;
    thumbnail: string | null;
    decimals: string;
    balance: string;
    possibleSpam: boolean;
    verifiedContract: boolean;
    balanceFormatted: string;
    usdPrice: string | null;
    usdPrice24hrPercentChange: string | null;
    usdPrice24hrUsdChange: string | null;
    usdValue: string | null;
    usdValue24hrUsdChange: string | null;
    nativeToken: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IWalletSnapshot {
    id: number;
    walletId: number;
    native_balance: string;
    native_balance_formatted: string;
    native_balance_usd: string;
    token_balance_usd: string;
    networth_usd: string;
    updatedAt: string;
    createdAt: string;
}

export default function Wallet({ wallet }: { wallet: IWallet }) {
    const convertNumbers = (
        num: string,
        prefix: string = "$",
        suffix: string | null = null
    ) => {
        let parsedNumber = parseFloat(num);
        return (
            <span
                className={parsedNumber > 0 ? "text-green-500" : "text-primary"}
            >
                {prefix}
                {parsedNumber.toFixed(2)}
                {suffix}
            </span>
        );
    };

    return (
        <Card className="border-none dark:bg-[#1A1C20]">
            <CardHeader>
                <CardTitle className="flex items-start justify-between">
                    <div className="flex flex-col gap-2">
                        <WalletAddress address={wallet.address} />
                    </div>
                    {wallet.type == "AGENT" && (
                        <Badge variant="secondary">Agent</Badge>
                    )}
                    {wallet.type == "USER" && <Badge>User</Badge>}
                </CardTitle>
                <CardDescription>
                    <p className="mt-2">
                        Balance:{" "}
                        {convertNumbers(wallet.WalletSnapshot[0].networth_usd)}
                    </p>
                </CardDescription>
            </CardHeader>
            <CardContent className="text-sm flex flex-col gap-2">
                <div className="flex justify-between">
                    <p>Total Eth</p>
                    <p>
                        {convertNumbers(
                            wallet.WalletSnapshot[0].native_balance_formatted,
                            " ",
                            " ETH"
                        )}{" "}
                    </p>
                </div>
                <div className="flex justify-between">
                    <p>Total Eth (USD)</p>
                    <p>
                        {convertNumbers(
                            wallet.WalletSnapshot[0].native_balance_usd
                        )}
                    </p>
                </div>
                <div className="flex justify-between">
                    <p>Token Balance</p>
                    <p>
                        {convertNumbers(
                            wallet.WalletSnapshot[0].token_balance_usd
                        )}
                    </p>
                </div>
            </CardContent>
            <CardFooter className="justify-end gap-4">
                <BalanceSheet balances={wallet.WalletBalance} />
                <Button variant={"ghost"} size={"sm"}>
                    <List />
                    Transactions
                </Button>
            </CardFooter>
        </Card>
    );
}

const BalanceSheet = ({ balances }: { balances: IWalletBalance[] }) => {
    return (
        <Sheet>
            <SheetTrigger>
                <Button variant={"ghost"} size={"sm"}>
                    <Coins />
                    Balances
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full md:w-[50vw] !max-w-full">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 text-primary">
                        <Coins /> Wallet Balances
                    </SheetTitle>
                    <SheetDescription>
                        <div className="overflow-x-auto overflow-y-scroll h-screen pb-[100px]">
                            <table className="min-w-full border-collapse text-sm">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left border-b">
                                            Symbol
                                        </th>
                                        <th className="px-4 py-2 text-left border-b">
                                            Name
                                        </th>
                                        <th className="px-4 py-2 text-left border-b">
                                            Balance
                                        </th>
                                        <th className="px-4 py-2 text-left border-b">
                                            Value USD
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {balances.map((balance) => (
                                        <tr
                                            key={balance.id}
                                            className="border-b"
                                        >
                                            <td className="px-4 py-2">
                                                {balance.symbol}
                                            </td>
                                            <td className="px-4 py-2">
                                                {balance.name}
                                            </td>
                                            <td className="px-4 py-2">
                                                {balance.balanceFormatted}
                                            </td>
                                            <td className="px-4 py-2">
                                                {balance.usdValue ?? "N/A"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
};

const TransactionsSheet = ({ transactions }: { transactions: any[] }) => {};
