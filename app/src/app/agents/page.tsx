"use client";
import { callAPI } from "@/utils/api";
import { useEffect, useState } from "react";

import Trader, { ITrader } from "@/components/app/Trader";
import { Copy, DiamondPlus, RefreshCcw, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import Agent, { IAgent } from "@/components/app/Agent";

export default function Agents() {
    const [agents, setAgents] = useState<IAgent[] | []>([]);
    const [isFetching, setFetching] = useState(false);

    const getAgents = async () => {
        setFetching(true);
        const response = await callAPI("/agent");
        setAgents(response.status ? response.response : []);
        setFetching(false);
    };

    useEffect(() => {
        getAgents();
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex gap-2 items-center">
                    <User />
                    Your Agents
                </h3>
                <Button disabled={isFetching} onClick={getAgents}>
                    <RefreshCcw /> Refresh
                </Button>
            </div>

            {agents.length <= 0 && <AgentSkeleton />}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {agents.map((agent) => (
                    <Agent onRefresh={getAgents} key={agent.id} agent={agent} />
                ))}
            </div>
        </div>
    );
}

const AgentSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((index) => (
            <div
                key={`skeleton-${index}`}
                className="flex flex-col gap-4 w-full"
            >
                <Skeleton className="h-[125px] rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        ))}
    </div>
);
