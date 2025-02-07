"use client";
import { useUser } from "@/stores/user";

export default function Home() {
    const user = useUser();
    return (
        <div className="flex flex-col">
            <CryptoCard
                userName={user.data.welcomeName as string}
                wallets={user.wallets}
            />
        </div>
    );
}

const CryptoCard = ({
    userName,
    wallets,
}: {
    userName: string;
    wallets: any;
}) => {
    return (
        <div className="flex flex-col justify-between items-start gap-2">
            <h2 className="font-semibold">Hey {userName}</h2>
            {wallets.map((wallet: any) => (
                <div
                    key={wallet.address}
                    className="flex flex-col gap-2 text-sm"
                >
                    <p>
                        {wallet.type} : {wallet.address}
                    </p>
                </div>
            ))}
        </div>
    );
};
