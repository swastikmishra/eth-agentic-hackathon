import React from "react";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@/components/ui/table";

export interface WalletSnapshot {
    usdValue: number;
    timestamp: string; // or Date, if you convert it before using
}

export type WalletType = "USER" | "AGENT";

export interface Wallet {
    id: number;
    cuid: string;
    createdAt: string;
    updatedAt: string;
    type: WalletType;
    walletId: string;
    address: string;
    chainType: string;
    userId?: number;
    agentId?: number;
    WalletSnapshot: WalletSnapshot[];
}

interface WalletListProps {
    wallets: Wallet[];
}

/**
 * Helper to get the most recent USD balance from a wallet's snapshots.
 * If no snapshot exists, returns null.
 */
const getLatestUsdBalance = (wallet: Wallet): number | null => {
    if (!wallet.WalletSnapshot || wallet.WalletSnapshot.length === 0)
        return null;
    // Find the snapshot with the latest timestamp.
    const latestSnapshot = wallet.WalletSnapshot.reduce((latest, snapshot) => {
        return new Date(snapshot.timestamp) > new Date(latest.timestamp)
            ? snapshot
            : latest;
    }, wallet.WalletSnapshot[0]);
    return latestSnapshot.usdValue;
};

const WalletList: React.FC<WalletListProps> = ({ wallets }) => {
    return (
        <div className="p-4">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell className="font-semibold">Address</TableCell>
                        <TableCell className="font-semibold">Type</TableCell>
                        <TableCell className="font-semibold">
                            USD Balance
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {wallets.map((wallet) => {
                        const balance = getLatestUsdBalance(wallet);
                        return (
                            <TableRow key={wallet.cuid}>
                                <TableCell>
                                    <span className="font-mono text-sm">
                                        {wallet.address}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            wallet.type === "USER"
                                                ? "secondary"
                                                : "default"
                                        }
                                    >
                                        {wallet.type}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {balance !== null
                                        ? `$${balance.toFixed(2)}`
                                        : "N/A"}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};

export default WalletList;
