"use client";
import { useSidebarDropdown } from "@/hooks/sidebar";
import { WORKSPACE } from "@/types/supabase";
import React from "react";
import CurrentWorkspace from "./current-workspace";

type Props = {
  privateWorkspaces: WORKSPACE[] | [];
  sharedWorkspaces: WORKSPACE[] | [];
  collaboratingWorkspaces: WORKSPACE[] | [];
  defaultValues: WORKSPACE | undefined;
};
const WorkspaceDropdown = ({
  collaboratingWorkspaces,
  defaultValues,
  privateWorkspaces,
  sharedWorkspaces,
}: Props) => {
  const { isOpen, selectedOption, setSelectedOption } = useSidebarDropdown({
    collaboratingWorkspaces,
    defaultValues,
    privateWorkspaces,
    sharedWorkspaces,
  });
 console.log("private : ",privateWorkspaces)

  return (
    <div className="relative inline-block text-left">
      <div>
        <span>
          {selectedOption ? (
            <CurrentWorkspace workspace={selectedOption} />
          ) : (
            "Select a workspace"
          )}
        </span>
      </div>
      {isOpen && (
        <div className="origin-top-right absolute w-full rounded-md shadow-md z-50 h-[190px] bg-black backdrop-blur-lg group overflow-scroll border-[1px] border-muted"></div>
      )}
    </div>
  );
};

export default WorkspaceDropdown;
