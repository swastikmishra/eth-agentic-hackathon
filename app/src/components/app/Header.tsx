import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import Logo from "./Logo";
import { useUser } from "@/stores/user";

export default function Header() {
    const { setTheme } = useTheme();
    const { logout, authenticated } = usePrivy();
    const user = useUser();

    const logoutUser = () => {
        logout().then(() => {
            user.logout();
        });
    };

    return (
        <div className="fixed w-full left-0 right-0 top-0 z-50 shadow-lg SplashScreen">
            <header className="md:container md:mx-auto px-4 flex justify-between items-center py-4">
                <Link href="/">
                    <Logo white />
                </Link>
                <div className="flex items-center">
                    {authenticated && (
                        <Button
                            variant="outline"
                            onClick={logoutUser}
                            className="mr-2 text-white bg-transparent border-transparent shadow-none"
                        >
                            <LogOut />
                            Logout
                        </Button>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="link"
                                size="icon"
                                className="text-white outline-none"
                            >
                                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setTheme("system")}
                            >
                                System
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
        </div>
    );
}
