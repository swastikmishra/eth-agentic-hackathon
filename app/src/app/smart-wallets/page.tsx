"use client";
import { callAPI } from "@/utils/api";
import { useEffect, useState } from "react";

import Trader, { ITrader } from "@/components/app/Trader";
import { Copy, DiamondPlus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function SmartWallets() {
    const [traders, setTraders] = useState<ITrader[] | []>([]);
    const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
    const [walletAddress, setWalletAddress] = useState<string>("");

    const getTraders = async () => {
        const response = await callAPI("/trader");
        setTraders(response.status ? response.response : []);
    };

    const getInfo = async () => {
        const response = await callAPI("/trader/info");
        setLastUpdatedAt(
            response.status ? new Date(response.response.updatedAt) : new Date()
        );
    };

    const saveWalletAddress = async () => {
        let res = await callAPI("/trader/save", "POST", {
            walletAddress: walletAddress,
        });

        if (res.status) {
            toast("Smart wallet added successfully");
        } else {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
            });
        }

        await getTraders();
        await getInfo();

        toast(walletAddress);
    };

    useEffect(() => {
        getTraders();
        getInfo();
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex gap-2 items-center">
                    <User />
                    Top Traders
                    <Badge variant={"secondary"}>
                        Last updated at: {lastUpdatedAt?.toLocaleString()}
                    </Badge>
                </h3>
                <Dialog>
                    <DialogTrigger>
                        <Button variant={"secondary"}>
                            <DiamondPlus /> Follow Custom Address
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add wallet to follow</DialogTitle>
                            <DialogDescription>
                                Generate a random string here
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="link" className="sr-only">
                                    Wallet Address
                                </Label>
                                <Input
                                    onChange={(e) =>
                                        setWalletAddress(e.target.value)
                                    }
                                    id="link"
                                    placeholder="0x"
                                />
                            </div>
                        </div>
                        <DialogFooter className="justify-end">
                            <DialogClose>
                                <Button
                                    onClick={saveWalletAddress}
                                    type="button"
                                >
                                    Add Wallet
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {traders.length <= 0 && <TraderSkeleton />}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {traders.map((trader) => (
                    <Trader key={trader.id} trader={trader} />
                ))}
            </div>
        </div>
    );
}

export const TraderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((index) => (
            <div
                key={`skeleton-${index}`}
                className="flex flex-col gap-4 w-full"
            >
                <Skeleton className="h-[125px] rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        ))}
    </div>
);
