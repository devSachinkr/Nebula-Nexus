"use client";
import { useSidebarDropdown } from "@/hooks/sidebar";
import { WORKSPACE } from "@/types/supabase";
import React from "react";
import CurrentWorkspace from "./current-workspace";
import Typography from "../global/typography";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { useModal } from "@/lib/providers/modal-provider";
import CustomModal from "../global/custom-modal";
import WorkspaceForm from "../forms/workspace";

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
  
  const { isOpen, selectedOption, handleSelect, setIsOpen } =
    useSidebarDropdown({
      collaboratingWorkspaces,
      defaultValues,
      privateWorkspaces,
      sharedWorkspaces,
    });
  const { setOpen } = useModal();
  return (
    <div className="relative inline-block text-left">
      <div>
        <span onClick={() => setIsOpen(!isOpen)}>
          {selectedOption ? (
            <CurrentWorkspace workspace={selectedOption} />
          ) : (
            "Select a workspace"
          )}
        </span>
      </div>
      {isOpen && (
        <div className="origin-top-right absolute w-full rounded-md shadow-md z-50 h-[190px] bg-black backdrop-blur-lg group overflow-x-hidden border-[1px] border-muted">
          <div className="rounded-md flex flex-col">
            <div className="!p-2">
              {!!privateWorkspaces.length && (
                <>
                  <Typography
                    className="text-muted-foreground"
                    variant="p"
                    text="Private"
                  />
                  <Separator orientation="horizontal" className="w-full" />

                  {privateWorkspaces.map((w) => (
                    <CurrentWorkspace
                      key={w.id}
                      workspace={w}
                      select={handleSelect}
                    />
                  ))}
                </>
              )}
              <Separator orientation="horizontal" className="w-full" />
              {!!sharedWorkspaces.length && (
                <>
                  <Typography
                    className="text-muted-foreground"
                    variant="p"
                    text="Shared"
                  />
                  <Separator orientation="horizontal" className="w-full" />
                  {sharedWorkspaces.map((w) => (
                    <CurrentWorkspace
                      key={w.id}
                      workspace={w}
                      select={handleSelect}
                    />
                  ))}
                </>
              )}
            </div>
            <Button
              className="!m-2 mt-3 !flex items-center justify-center gap-x-3"
              variant="secondary"
              onClick={() =>
                setOpen(
                  <CustomModal
                    title="Create Workspace"
                    desc="Workspace allows  you to share and collaborate on projects with your team."
                  >
                    <WorkspaceForm />
                  </CustomModal>
                )
              }
            >
              <PlusCircle size={25} />
              Create Workspace
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceDropdown;
