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

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { callAPI } from "@/utils/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
    const router = useRouter();

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

    const onSubmit = async (
        intitalDeposit: number,
        tradeAllocation: number
    ) => {
        const request = await callAPI("/agent", "POST", {
            traderId: trader.id,
            intitalDeposit: intitalDeposit,
            tradeAllocationPercentage: tradeAllocation,
        });
        if (request.status) {
            toast("Agent created successfully");
            router.push("/agents");
        } else {
            toast("Uh oh! Something went wrong.");
            console.error(request.error);
        }
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
                <CreateAgent onSubmit={onSubmit} trader={trader} />
            </CardFooter>
        </Card>
    );
}

const CreateAgent = ({
    trader,
    onSubmit,
}: {
    trader: ITrader;
    onSubmit: (initialDeposit: number, tradeAllocation: number) => void;
}) => {
    const [initialDeposit, setInitialDeposit] = useState<number>(5);
    const [tradeAllocation, setTradeAllocation] = useState<number>(5);

    useEffect(() => {
        if (initialDeposit < 5) {
            setInitialDeposit(5);
        }

        if (tradeAllocation < 10) {
            setTradeAllocation(10);
        }
    }, [initialDeposit, tradeAllocation]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size={"sm"} disabled={trader.disabled}>
                    <FlipVertical2 />
                    Create Agent
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Agent to copy trade</DialogTitle>
                    <DialogDescription>
                        You should have sufficient balance to create an agent in
                        your wallet. <br />
                        5 USDC is the minimum initial deposit. <br />
                        10% is the minimum trade allocation percentage.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 items-start">
                        <Label htmlFor="initial-deposit" className="text-right">
                            Initial Deposit (USDC)
                        </Label>
                        <Input
                            id="initial-deposit"
                            value={initialDeposit}
                            onChange={(e) =>
                                setInitialDeposit(parseInt(e.target.value))
                            }
                            className="col-span-3"
                        />
                    </div>
                    <div className="flex flex-col gap-2 items-start">
                        <Label
                            htmlFor="trade-allocation"
                            className="text-right"
                        >
                            Trade Allocation (%)
                        </Label>
                        <Input
                            id="trade-allocation"
                            value={tradeAllocation}
                            onChange={(e) =>
                                setTradeAllocation(parseInt(e.target.value))
                            }
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={() => {
                            onSubmit(initialDeposit, tradeAllocation);
                        }}
                        type="button"
                    >
                        Create Agent
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
