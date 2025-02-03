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
    title: "Eth Agentic Hackathon",
    description: "Eth Agentic Hackathon",
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
                    enableSystem
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
