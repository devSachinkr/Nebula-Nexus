"use client";
import React from "react";
import { useSidebar } from "@/hooks/sidebar/index";
import { twMerge } from "tailwind-merge";
import WorkspaceDropdown from "./workspace-dropdown";
import { AuthUser } from "@supabase/supabase-js";
import db from "@/lib/supabase/db";
type Props = {
  workspaceId: string;
  className?: string;
  user: AuthUser;
};

const Sidebar = ({ workspaceId, className,user }: Props) => {
  const {
    collaboratorsWorkspacesData,
    foldersData,
    privateWorkSpacesData,
    sharedWorkplacesData,
    userSubscriptionData,
  } = useSidebar({ workspaceId, user });
  return (
    <aside
      className={twMerge(
        "hidden sm:flex sm:flex-col w-[280px] shrink-0 p-4 md:gap-4 !justify-between ",
        className
      )}
    >
      <div>
        <WorkspaceDropdown
          privateWorkspaces={privateWorkSpacesData}
          sharedWorkspaces={sharedWorkplacesData}
          collaboratingWorkspaces={collaboratorsWorkspacesData}
          defaultValues={[
            ...privateWorkSpacesData,
            ...sharedWorkplacesData,
            ...collaboratorsWorkspacesData,
          ].find((w) => w.id === workspaceId)}
        ></WorkspaceDropdown>
      </div>
    </aside>
  );
};

export default Sidebar;
