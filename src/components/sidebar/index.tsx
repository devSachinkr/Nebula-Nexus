"use client";
import React from "react";
import { useSidebar } from "@/hooks/sidebar/index";
import { twMerge } from "tailwind-merge";
import WorkspaceDropdown from "./workspace-dropdown";
import { AuthUser } from "@supabase/supabase-js";
import db from "@/lib/supabase/db";
import Loader from "../global/loader";
import Plan from "../plan";
import Navigation from "./navigation";
import { ScrollArea } from "../ui/scroll-area";
import FolderList from "./folder-list";
type Props = {
  workspaceId: string;
  className?: string;
  user: AuthUser;
};

const Sidebar = ({ workspaceId, className, user }: Props) => {
  const {
    collaboratorsWorkspacesData,
    foldersData,
    privateWorkSpacesData,
    sharedWorkplacesData,
    userSubscriptionData,
    loading,
  } = useSidebar({ workspaceId, user });

  if (loading) return <Loader />;
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
        />
        <Plan
          folderLength={foldersData.length || 0}
          subscription={userSubscriptionData}
        />
        <Navigation className="" workspaceId={workspaceId} />
        <ScrollArea className=" h-[450px] overflow-x-hidden  relative">
          <div className="pointer-evegts-none w-full  bottom-0 h-20 bg-gradient-to-t from-background to-transparent">
            <FolderList workspaceFolder={foldersData} workspaceId={workspaceId} />
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
};

export default Sidebar;
