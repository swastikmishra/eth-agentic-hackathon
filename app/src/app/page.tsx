"use client";
import { useUser } from "@/stores/user";

export default function Home() {
    const user = useUser();
    return (
        <div className="flex flex-col">
            <CryptoCard
                userName={user.welcomeName as string}
                walletAddress={user.privy?.wallet?.address as string}
            />
        </div>
    );
}

const CryptoCard = ({
    userName,
    walletAddress,
}: {
    userName: string;
    walletAddress: string;
}) => {
    return (
        <div className="flex flex-col justify-between items-start gap-2">
            {/* Header with user name and wallet address */}
            <h2 className="font-semibold">Hey {userName}</h2>
            <p className="break-words">Wallet: {walletAddress}</p>
        </div>
    );
};
