import { Waypoints } from "lucide-react";

export default function Logo({
    animate,
    white,
}: {
    animate?: boolean;
    white?: boolean;
}) {
    return (
        <h1
            className={
                `text-2xl font-bold flex items-center transition-opacity duration-500 ` +
                (animate ? `flex-col` : `flex-row`) +
                " " +
                (white ? `text-white` : "text-[#2ecc71]")
            }
        >
            <Waypoints
                className={"h-8 w-8 mr-2 " + (animate ? "animate-bounce" : "")}
            />
            Opulent
        </h1>
    );
}
