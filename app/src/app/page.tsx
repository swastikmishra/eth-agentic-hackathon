"use client";
import { useEffect } from "react";

export default function Home() {
    useEffect(() => {
        console.log("Mounted");
    });

    return <h1>Hello World</h1>;
}
