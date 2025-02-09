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
import { Coins, DollarSign, List } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { callAPI } from "@/utils/api";
import TxAddress from "./TxAddress";

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
const convertNumbers = (
    num: string | null,
    prefix: string = "$",
    suffix: string | null = null
) => {
    let parsedNumber = 0;
    if (num != null) parsedNumber = parseFloat(num);
    return (
        <span className={parsedNumber > 0 ? "text-green-500" : ""}>
            {prefix}
            {parsedNumber.toFixed(6)}
            {suffix}
        </span>
    );
};

export default function Wallet({ wallet }: { wallet: IWallet }) {
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
                <BalanceGraph {...wallet} />
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
                {wallet.type == "USER" && (
                    <DepositPopup address={wallet.address} />
                )}
                <TransactionsSheet walletId={wallet.id} />
                <BalanceSheet balances={wallet.WalletBalance} />
            </CardFooter>
        </Card>
    );
}

const BalanceGraph = (wallet: IWallet) => {
    const chartConfig = {
        balance: {
            label: "Balance $",
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig;

    // rever WalletSnapshot array so that the most recent snapshot is first
    const chartData = wallet.WalletSnapshot.reverse().map((snapshot) => ({
        date: new Date(snapshot.createdAt).toLocaleTimeString(),
        balance: parseFloat(snapshot.networth_usd),
    }));

    return (
        <ChartContainer config={chartConfig}>
            <AreaChart accessibilityLayer data={chartData} margin={{}}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                />
                <defs>
                    <linearGradient
                        id="fillBalance"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop
                            offset="5%"
                            stopColor="var(--color-balance)"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="95%"
                            stopColor="var(--color-balance)"
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                </defs>
                <Area
                    dataKey="balance"
                    type="natural"
                    fill="url(#fillBalance)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                />
            </AreaChart>
        </ChartContainer>
    );
};

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
                                                {parseFloat(
                                                    balance.balanceFormatted
                                                ).toFixed(4)}
                                            </td>
                                            <td className="px-4 py-2">
                                                {convertNumbers(
                                                    balance.usdValue
                                                )}
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

const DepositPopup = ({ address }: { address: string }) => {
    return (
        <Dialog>
            <DialogTrigger>
                <Button variant={"secondary"} size={"sm"}>
                    <DollarSign /> Deposit
                </Button>
            </DialogTrigger>
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-primary">
                        <DollarSign /> Deposit Funds
                    </DialogTitle>
                    <DialogDescription>
                        <div className="mt-2">
                            <p>Send funds to your wallet address.</p>
                            <div className="flex items-center space-x-2 mt-2">
                                <div className="grid flex-1 gap-2">
                                    <Label htmlFor="link" className="sr-only">
                                        Wallet Address
                                    </Label>
                                    <Input id="link" value={address} readOnly />
                                    <img
                                        className="m-auto"
                                        alt={`${address} QR Code`}
                                        width="250px"
                                        height="250px"
                                        src={`https://quickchart.io/qr?size=250&text=${address}`}
                                    />
                                </div>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

const TransactionsSheet = ({ walletId }: { walletId: number }) => {
    interface ITransaction {
        id: string;
        walletId: number;
        txnOwner: string;
        category: string;
        description: string;
        tokenAddress: string;
        amount: number;
        decimals: number;
        status: string;
        txnHash: string;
        createdAt: string; // ISO date string
        toWalletId: number;
    }

    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [isOpen, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const getTransactions = async () => {
        setIsLoading(true);
        const response = await callAPI(`/wallet/${walletId}/transactions`);
        if (response.status) {
            // @ts-ignore
            setTransactions(response.response);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (isOpen) {
            getTransactions();
        }
    }, [isOpen]);

    return (
        <Sheet onOpenChange={(open) => setOpen(open)}>
            <SheetTrigger>
                <Button variant={"ghost"} size={"sm"}>
                    <List />
                    History
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full md:w-[80vw] !max-w-full">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 text-primary">
                        <List /> Wallet Transactions
                    </SheetTitle>
                    <SheetDescription>
                        <div className="overflow-x-auto overflow-y-scroll h-screen pb-[100px]">
                            <table className="min-w-full border-collapse text-sm">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 border-b text-left">
                                            Txn Hash
                                        </th>

                                        <th className="px-4 py-2 border-b text-left">
                                            Status
                                        </th>
                                        <th className="px-4 py-2 border-b text-left">
                                            Category
                                        </th>
                                        <th className="px-4 py-2 border-b text-left">
                                            Amount
                                        </th>
                                        <th className="px-4 py-2 border-b text-left">
                                            Date
                                        </th>
                                        <th className="px-4 py-2 border-b text-left">
                                            Description
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((txn) => (
                                        <tr key={txn.id} className="border-b">
                                            <td className="px-4 py-2">
                                                <TxAddress
                                                    address={txn.txnHash}
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <TxStatus status={txn.status} />
                                            </td>
                                            <td className="px-4 py-2">
                                                {txn.category}
                                            </td>
                                            <td className="px-4 py-2">
                                                {convertNumbers(
                                                    txn.amount.toString(),
                                                    " ",
                                                    " "
                                                )}
                                            </td>
                                            <td className="px-4 py-2">
                                                {new Date(
                                                    txn.createdAt
                                                ).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-2 max-w-[200px]">
                                                {txn.description}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {isLoading && <>Loading Transactions...</>}
                        </div>
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
};

const TxStatus = ({ status }: { status: string }) => {
    const statusClasses: Record<string, string> = {
        SUCCESS: "text-green-800 dark:text-green-200",
        PENDING: "text-yellow-800  dark:text-yellow-200",
        FAILED: "text-red-800 dark:text-red-200",
    };

    return (
        <span className={`font-semibold text-md ${statusClasses[status]}`}>
            {status}
        </span>
    );
};
