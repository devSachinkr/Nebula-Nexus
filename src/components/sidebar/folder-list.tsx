"use client";
import { FOLDER } from "@/types/supabase";
import { PlusCircleIcon, PlusIcon } from "lucide-react";
import React from "react";
import { Accordion } from "../ui/accordion";
import { useFolder } from "@/hooks/folder";
import Tooltip from "../global/tool-tip";
import DropDown from "./drop-down";
import { DropDownProvider } from "@/lib/providers/drop-down-provide";

type Props = {
  workspaceFolder: FOLDER[] | null;
  workspaceId: string;
};

const FolderList = ({ workspaceFolder, workspaceId }: Props) => {
  const { addFolder, folders, folderId } = useFolder({
    workspaceId,
    workspaceFolder,
  });
  return (
    <>
      <div
        className="flex
            sticky 
            z-50 
            top-0 
            bg-background 
            w-full  
            h-10 
            group/title 
            justify-between 
            items-center 
            pr-4 
            text-Neutrals/neutrals-8
      "
      >
        <span
          className="text-Neutrals-8 
            font-bold 
            text-xs"
        >
          FOLDERS
        </span>
        <Tooltip text="Create Folder" position="right">
          <PlusCircleIcon
            onClick={addFolder}
            size={26}
            className="
                cursor-pointer
                hover:dark:text-white
              "
          />
        </Tooltip>
      </div>
      <Accordion
        type="multiple"
        defaultValue={[folderId || ""]}
        className="pb-20"
      >
        {folders
          ?.filter((folder) => !folder.inTrash)
          .map((folder) => (
            <DropDownProvider
              listType={"folder"}
              folderId={folder.id}
              title={folder.title}
              key={folder.id}
            >
              <DropDown
                key={folder.id}
                title={folder.title}
                listType="folder"
                id={folder.id}
                iconId={folder.iconId}
              />
            </DropDownProvider>
          ))}
      </Accordion>
    </>
  );
};

export default FolderList;
