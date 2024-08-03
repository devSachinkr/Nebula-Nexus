"use client";
import React from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  DropDownProvider,
  useDropdown,
} from "@/lib/providers/drop-down-provide";
import Emoji from "../global/emoji-picker";
import clsx from "clsx";
import Loader from "../global/loader";
import Tooltip from "../global/tool-tip";
import { PlusCircleIcon, Trash2 } from "lucide-react";
import { useAppState } from "@/lib/providers/state-provider";
import Typography from "../global/typography";

type Props = {
  title: string;
  listType: "folder" | "file" | "native";
  id: string;
  iconId: string;
  children?: React.ReactNode;
  disabled?: boolean;
  customIcon?: React.ReactNode;
};

const DropDown = ({
  iconId,
  id,
  listType,
  title,
  children,
  customIcon,
  disabled,
  ...props
}: Props) => {
  const {
    style,
    navigatePage,
    identified,
    emojiHandler,
    editing,
    loading,
    folderTitle,
    handleDoubleClick,
    handleBlur,
    folderTitleChange,
    addFile,
    fileTitle,
    fileTitleChange,
    moveTrash,
  } = useDropdown();
  const { state, workspaceId } = useAppState();

  return (
    <AccordionItem
      value={id}
      className={style}
      onClick={(e) => {
        e.stopPropagation();
        navigatePage(id, listType);
      }}
    >
      {listType === "folder" && (
        <AccordionTrigger
          id={listType}
          className="hover:no-underline p-2 dark:text-muted-foreground text-sm"
        >
          <div className={identified}>
            <div className="flex gap-4 items-center justify-center overflow-hidden">
              <div className="relative">
                <Emoji getValue={emojiHandler}>{iconId}</Emoji>
              </div>
              <input
                type="text"
                value={listType === "folder" ? folderTitle : fileTitle}
                className={clsx(
                  "outline-none overflow-hidden w-[140px] text-Neutrals/neutrals-7",
                  {
                    "bg-muted cursor-text": editing,
                    "bg-transparent cursor-pointer": !editing,
                  }
                )}
                readOnly={listType === "folder" ? !editing : false}
                onDoubleClick={handleDoubleClick}
                onBlur={handleBlur}
                onChange={
                  listType === "folder" ? folderTitleChange : fileTitleChange
                }
              />
            </div>
            <div className="h-full flex  group-hover/file:block rounded-sm absolute right-0 items-center gap-2 justify-center ">
              <Tooltip
                text={listType === "folder" ? "Delete Folder" : "Delete File"}
                position="right"
              >
                <Trash2
                  onClick={moveTrash}
                  size={15}
                  className={clsx(
                    "hover:dark:text-white dark:text-neutral-700"
                  )}
                />
              </Tooltip>
              {listType === "folder" && !editing && (
                <Tooltip text="Create File" position="right" delay={0}>
                  <PlusCircleIcon
                    onClick={addFile}
                    size={15}
                    className="hover:dark:text-white dark:text-neutral-700 "
                  />
                </Tooltip>
              )}
            </div>
          </div>
        </AccordionTrigger>
      )}
      {listType === "file" && (
        <div className={identified}>
          <div className="flex gap-4 items-center justify-center overflow-hidden">
            <div className="relative">
              <Emoji getValue={emojiHandler}>{iconId}</Emoji>
            </div>
            <input
              type="text"
              value={fileTitle}
              className={clsx(
                "outline-none overflow-hidden w-[140px] text-Neutrals/neutrals-7",
                {
                  "bg-muted cursor-text": editing,
                  "bg-transparent cursor-pointer": !editing,
                }
              )}
              readOnly={!editing}
              onDoubleClick={handleDoubleClick}
              onBlur={handleBlur}
              onChange={fileTitleChange}
            />
          </div>
          <div className="h-full flex  group-hover/file:block rounded-sm absolute right-0 items-center gap-2 justify-center pr-4">
            <Tooltip text={"Delete File"} position="right">
              <Trash2
                onClick={moveTrash}
                size={15}
                className={clsx("hover:dark:text-white  dark:text-neutral-700")}
              />
            </Tooltip>
          </div>
        </div>
      )}

      <AccordionContent>
        {state.workspaces
          .find((workspace) => workspace.id === workspaceId)
          ?.folders.find((folder) => folder.id === id)
          ?.files.filter((file) => !file.in_trash)
          .map((file) => {
            const customId = `${id}folder${file.id}`;
            return (
              <DropDownProvider
                listType={"file"}
                folderId={customId}
                title={file.title}
                key={file.id}
              >
                <DropDown
                  key={file.id}
                  title={file.title}
                  listType="file"
                  id={customId}
                  iconId={file.icon_id}
                />
              </DropDownProvider>
            );
          })}
      </AccordionContent>
    </AccordionItem>
  );
};

export default DropDown;
