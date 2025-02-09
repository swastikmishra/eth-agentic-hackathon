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
import { DollarSign, FlaskRound, FlipVertical2 } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Represents a Wallet object within the main object
export interface IWallet {
    id: number;
    cuid: string;
    createdAt: string; // ISO timestamp string
    updatedAt: string; // ISO timestamp string
    type: string;
    walletId: string;
    address: string;
    chainType: string;
    userId: number;
    agentId: number;
}

// Represents the Trader object
export interface ITrader {
    id: number;
    cuid: string;
    createdAt: string; // ISO timestamp string
    updatedAt: string; // ISO timestamp string
    visible: boolean;
    disabled: boolean;
    walletAddress: string;
    nickname: string;
    realizeProfit: string;
    unrealizeProfit: string;
    totalProfit: string;
    roi: string;
    totalTrades: string;
    totalBuy: number;
    totalSell: number;
    userId: number;
}

// Represents the top-level object (for example, an Agent)
export interface IAgent {
    id: number;
    cuid: string;
    createdAt: string; // ISO timestamp string
    updatedAt: string; // ISO timestamp string
    initialDeposit: number;
    tradeAllocationPercentage: number;
    nickname: string;
    userId: number;
    traderId: number;
    logs: string[];
    status: string;
    Wallet: IWallet[]; // Notice the capitalized property name as in your JSON
    Trader: ITrader; // Notice the capitalized property name as in your JSON
}

export default function Agent({
    agent,
    onRefresh,
}: {
    agent: IAgent;
    onRefresh: () => void;
}) {
    const router = useRouter();

    const [isFetching, setFetching] = useState(false);

    const initiateTransfer = async () => {
        setFetching(true);
        const response = await callAPI(`/agent/initiate/${agent.id}`);
        if (!response.status) {
            toast("Failed to initiate transfer");
        }
        setFetching(false);
        onRefresh();
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

    const AgentStatus = ({ status }: { status: string }) => {
        const statusClasses: Record<string, string> = {
            CREATED:
                "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            WAITING:
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
            RUNNING:
                "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
            KILLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
            STOPPED:
                "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
        };

        return (
            <span
                className={`px-2 py-1 rounded text-sm shadow-md ${statusClasses[status]}`}
            >
                {status}
            </span>
        );
    };

    return (
        <Card className="border-none dark:bg-[#1A1C20]">
            <CardHeader>
                <CardTitle className="flex items-start justify-between">
                    <div className="flex flex-col gap-2">
                        <WalletAddress address={agent.Wallet[0].address} />
                        <span className="dark:text-blue-300 text-blue-400 text-sm">
                            {agent.nickname}
                        </span>
                    </div>
                    <AgentStatus status={agent.status} />
                </CardTitle>
                <CardDescription>
                    {agent.status == "CREATED" && (
                        <div className="mt-2 flex flex-col gap-2">
                            <p className="text-yellow-500">
                                Your agent is created. Please transfer funds
                                from your wallet to Agent wallet to start the
                                agent.
                            </p>
                            <Button
                                disabled={isFetching}
                                onClick={initiateTransfer}
                            >
                                <DollarSign /> Transfer Funds
                            </Button>
                        </div>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent className="text-sm flex flex-col gap-2">
                <div className="flex justify-between">
                    <p>Initial Deposit</p>
                    <span>${agent.initialDeposit}</span>
                </div>
                <div className="flex justify-between">
                    <p>Trade Allocation %</p>
                    <span>{agent.tradeAllocationPercentage}%</span>
                </div>
            </CardContent>
            <CardFooter className="justify-end"></CardFooter>
        </Card>
    );
}
