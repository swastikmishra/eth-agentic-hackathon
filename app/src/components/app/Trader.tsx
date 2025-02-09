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
import { FlipVertical2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface ITrader {
    id: number;
    cuid: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    visible: boolean;
    disabled: boolean;
    walletAddress: string;
    realizeProfit: string;
    unrealizeProfit: string;
    totalProfit: string;
    roi: string;
    totalTrades: string;
    totalBuy: number;
    totalSell: number;
    userId: number;
    nickname: string;
}

export default function Trader({ trader }: { trader: ITrader }) {
    const convertRoi = (roi: string) => {
        return (
            <span
                className={trader.disabled ? "text-red-500" : "text-green-500"}
            >
                {(parseFloat(roi) * 100).toFixed(2)}%
            </span>
        );
    };

    const convertNumbers = (num: string) => {
        let parsedNumber = parseFloat(num);
        return (
            <span
                className={
                    parsedNumber >= 0 ? "text-green-500" : "text-red-500"
                }
            >
                ${parsedNumber.toFixed(2)}
            </span>
        );
    };

    return (
        <Card className="border-none dark:bg-[#1A1C20]">
            <CardHeader>
                <CardTitle className="flex items-start justify-between">
                    <div className="flex flex-col gap-2">
                        <WalletAddress address={trader.walletAddress} />
                        <span className="dark:text-blue-300 text-blue-400 text-sm">
                            {trader.nickname}
                        </span>
                    </div>
                    {trader.userId == 0 && (
                        <Badge variant="secondary">System</Badge>
                    )}
                    {trader.userId !== 0 && <Badge>User</Badge>}
                </CardTitle>
                <CardDescription>
                    <p className="mt-2">
                        Realized ROI: {convertRoi(trader.roi)}
                    </p>
                </CardDescription>
            </CardHeader>
            <CardContent className="text-sm flex flex-col gap-2">
                <div className="flex justify-between">
                    <p>Total Profit</p>
                    <p>{convertNumbers(trader.totalProfit)}</p>
                </div>
                <div className="flex justify-between">
                    <p>Realized Profit</p>
                    <p>{convertNumbers(trader.realizeProfit)}</p>
                </div>
                <div className="flex justify-between">
                    <p>Unrealized Profit</p>
                    <p>{convertNumbers(trader.unrealizeProfit)}</p>
                </div>
            </CardContent>
            <CardFooter className="justify-end">
                <Button size={"sm"} disabled={trader.disabled}>
                    <FlipVertical2 />
                    Follow Trade
                </Button>
            </CardFooter>
        </Card>
    );
}
