import "./globals.css";
import { Open_Sans, Montserrat } from "next/font/google";
import { Metadata } from "next";
import PrivyProvider from "@/providers/PrivyProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import AppProvider from "@/providers/AppProvider";

const open_sans = Open_Sans({
    subsets: ["latin"],
    variable: "--font-open-sans",
    display: "swap",
});

const monsterrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-monsterrat",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Mirror Battle",
    description:
        "MirrorBattle is a platform where crypto traders deploy agents to copy-trade 'smart money wallets' and compete in PvP battles.",
    other: {
        "apple-mobile-web-app-title": "Mirror Battle",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${monsterrat.variable} ${open_sans.variable}`}
        >
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    disableTransitionOnChange
                >
                    <PrivyProvider>
                        <AppProvider>{children}</AppProvider>
                    </PrivyProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
