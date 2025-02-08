import { Bot, LayoutDashboard, SquareUserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Avatar from "./Avatar";
import { useUser } from "@/stores/user";

export default function Navbar() {
    const pathname = usePathname();
    const user = useUser();

    return (
        <nav className="flex pb-6 text-sm justify-between">
            <div className="flex items-center gap-6">
                <Link
                    href="/"
                    className={
                        "flex gap-2 bg-background shadow-sm font-semibold rounded-md p-4 items-center" +
                        " " +
                        (pathname == "/" ? "text-primary" : "")
                    }
                >
                    <LayoutDashboard size={20} /> Dashboard
                </Link>
                <Link
                    href="/agents"
                    className={
                        "flex gap-2 bg-background shadow-sm font-semibold rounded-md p-4 items-center" +
                        " " +
                        (pathname == "/agents" ? "text-primary" : "")
                    }
                >
                    <Bot size={20} /> Agents
                </Link>
                <Link
                    href="/smart-wallets"
                    className={
                        "flex gap-2 bg-background shadow-sm font-semibold rounded-md p-4 items-center" +
                        " " +
                        (pathname == "/smart-wallets" ? "text-primary" : "")
                    }
                >
                    <SquareUserRound size={20} />
                    Smart Wallets
                </Link>
            </div>
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">{user.welcomeName}</h2>
                <Avatar username={user.welcomeName as string} />
            </div>
        </nav>
    );
}
