"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function Error() {
    return (
        <div className="flex items-center w-full h-full flex-col justify-center gap-2">
            <h3 className="flex  gap-2 items-center text-red-500 text-lg">
                <AlertCircle /> Oops, you landed at a 404
            </h3>
            <p>
                Please go back to <Link className="text-primary" href="/">Dashboard</Link>
            </p>
        </div>
    );
}
