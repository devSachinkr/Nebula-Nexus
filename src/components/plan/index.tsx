"use client";
import { MAX_FOLDERS_FREE_PLAN } from "@/lib/constants";
import { useAppState } from "@/lib/providers/state-provider";
import { SUBSCRIPTIONS } from "@/types/supabase";
import { Gem } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Progress } from "../ui/progress";

type Props = {
  folderLength: number;
  subscription: SUBSCRIPTIONS | null;
};

const Plan = ({ folderLength, subscription }: Props) => {
  const { workspaceId, state } = useAppState();
  const [usagePercentage, setUsagePercentage] = useState(
    (folderLength / MAX_FOLDERS_FREE_PLAN) * 100
  );

  useEffect(() => {
    const stateFolder = state.workspaces.find((w) => w.id === workspaceId)
      ?.folders.length
      ? 0
      : 1;
    if (stateFolder === undefined) return;
    setUsagePercentage((folderLength / MAX_FOLDERS_FREE_PLAN) * 100);
  }, [state, workspaceId]);
  return (
    <article className="mb-4">
      {subscription?.status !== "active" && (
        <div
          className="flex 
            gap-2
            text-muted-foreground
            mb-2
            items-center
            gap-x-4
            
    "
        >
          <div className=" flex items-center h-full ">
            <Gem className="text-green-500" size={25} />
          </div>
          <div
            className="flex 
    justify-between 
    w-full 
    items-center
    "
          >
            <div>Free Plan</div>
            <small>{usagePercentage.toFixed(0)}% / 100%</small>
          </div>
        </div>
      )}
      {subscription?.status !== "active" && (
        <Progress value={usagePercentage} className="h-1" />
      )}
    </article>
  );
};

export default Plan;
