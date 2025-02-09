import Link from "next/link";

export default function TxAddress({ address }: { address: string }) {
    return (
        <Link
            target="explorer"
            href={`https://basescan.org/tx/${address}`}
            className="hover:text-blue-500"
        >
            {formatCryptoAddress(address)}
        </Link>
    );
}

function formatCryptoAddress(address: string) {
    // If the address is too short, return it as is.
    if (address.length <= 8) return address;

    const firstPart = address.slice(0, 6);
    const lastPart = address.slice(-6);
    return `${firstPart}...${lastPart}`;
}
