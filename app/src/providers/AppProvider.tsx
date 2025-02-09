"use client";

import Header from "@/components/app/Header";
import Logo from "@/components/app/Logo";
import Navbar from "@/components/app/Navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/stores/user";
import { getAccessToken, usePrivy } from "@privy-io/react-auth";
import { LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";

export default function AppProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [showSplash, setShowSplash] = useState(true);
    const user = useUser();
    const { ready, authenticated, login, user: PrivyUser } = usePrivy();

    const loginUser = () => {
        login({
            prefill: { type: "email", value: "test-3250@privy.io" },
        });
    };

    useEffect(() => {
        if (ready) {
            setShowSplash(false);
        }
    }, [ready]);

    useEffect(() => {
        if (PrivyUser && !user.authorized) {
            if (!user.isLoggingIn) {
                user.login({
                    user: PrivyUser,
                });
            }
        }
    }, [PrivyUser, user]);

    useEffect(() => {
        let timer = null;
        if (user.authorized) {
            timer = setInterval(() => {
                user.refreshAccessToken();
            }, 5 * 60 * 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [user]);

    return (
        <>
            <Toaster />
            <SplashScreen visible={showSplash} />
            <Header />
            <main className="md:container md:mx-auto px-4 pt-[90px] min-h-screen pb-12">
                {!showSplash && (
                    <>
                        {!authenticated && <Login login={loginUser} />}
                        {authenticated && !user.authorized && (
                            <ProfileSkeleton />
                        )}
                        {authenticated && user.authorized && (
                            <>
                                <Navbar />
                                {children}
                            </>
                        )}
                    </>
                )}
            </main>
        </>
    );
}

const Login = (props: { login: any }) => (
    <div className="flex flex-col mx-auto h-full justify-center items-center gap-4">
        <h1 className="font-semibold">Hey there, please login to continue</h1>
        <p>Use OTP: 076747</p>
        <Button onClick={props.login}>
            <LogIn />
            Login
        </Button>
    </div>
);

const SplashScreen = ({ visible }: { visible: boolean }) => (
    <div
        className={
            "flex flex-col items-center justify-center space-y-4 py-8 w-screen h-screen SplashScreen transition-all duration-700 ease-linear absolute left-0 right-0 bottom-0 z-[99]" +
            " " +
            (visible ? "top-0" : "top-[-110vh]")
        }
    >
        <Logo animate={true} white={true} />
    </div>
);

const ProfileSkeleton = () => (
    <div className="flex flex-col space-y-3 h-screen items-center justify-center">
        <p className="text-primary opacity-50">Loading App</p>
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
        </div>
    </div>
);
