"use client";
import { useUser } from "@/stores/user";
import { useEffect, useState } from "react";

export default function Home() {
    const user = useUser();
    const [wallets, setWallets] = useState([]);

    useEffect(() => {});

    return <div className="flex flex-col">
        
    </div>;
}
