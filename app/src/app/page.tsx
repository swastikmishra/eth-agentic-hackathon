"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { callAPI } from "@/utils/api";
import { RefreshCcw, WalletIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Wallet, { IWallet } from "@/components/app/Wallet";
import { Button } from "@/components/ui/button";

export default function Home() {
    const [wallets, setWallets] = useState([]);
    const [isFetching, setFetching] = useState(false);

    const getUserWallets = async () => {
        setFetching(true);
        const response = await callAPI("/wallet");
        if (response.status) {
            setWallets(response.response);
        }
        setFetching(false);
    };

    useEffect(() => {
        getUserWallets();
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex gap-2 items-center">
                    <WalletIcon />
                    Your Wallets
                </h3>
                <Button disabled={isFetching} onClick={getUserWallets}>
                    <RefreshCcw /> Refresh
                </Button>
            </div>

            {(wallets.length <= 0 || isFetching) && <WalletSkeleton />}

            {!isFetching && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {wallets.map((wallet: IWallet) => (
                        <Wallet key={wallet.id} wallet={wallet} />
                    ))}
                </div>
            )}
        </div>
    );
}

const WalletSkeleton = () => (
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
