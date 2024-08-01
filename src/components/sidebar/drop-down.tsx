"use client";
import React from "react";
import { AccordionItem, AccordionTrigger } from "../ui/accordion";
import {
  DropDownProvider,
  useDropdown,
} from "@/lib/providers/drop-down-provide";
import Emoji from "../global/emoji-picker";
import clsx from "clsx";
import Loader from "../global/loader";
import Tooltip from "../global/tool-tip";
import { PlusCircleIcon, Trash2 } from "lucide-react";

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
  } = useDropdown();

  return (
    <AccordionItem
      value={id}
      className={style}
      onClick={(e) => {
        e.stopPropagation();
        navigatePage(id, listType);
      }}
    >
      <AccordionTrigger
        id={listType}
        className="hover:no-underline p-2 dark:text-muted-foreground text-sm"
        disabled={listType === "file"}
      >
        <div className={identified}>
          <div className="flex gap-4 items-center justify-center overflow-hidden">
            <div className="relative">
              <Emoji getValue={emojiHandler}>
                {!loading ? iconId : <Loader />}
              </Emoji>
            </div>
            <input
              type="text"
              value={listType === "folder" ? folderTitle : fileTitle}
              className={clsx(
                "outline-none overflow-hidden w-[140px] text-neutral-400",
                {
                  "bg-muted cursor-text": editing,
                  "bg-transparent cursor-pointer": !editing,
                }
              )}
              onDoubleClick={handleDoubleClick}
              readOnly={!editing}
              onBlur={handleBlur}
              onChange={
                listType === "folder" ? folderTitleChange : fileTitleChange
              }
            />
          </div>
          <div className="h-full flex  group-hover/file:block rounded-sm absolute right-0 items-center gap-2 justify-center ">
            <Tooltip text="Delete Folder" position="right">
              <Trash2
                size={15}
                className="hover:dark:text-white dark:text-neutral-700"
              />
            </Tooltip>
            {listType === "folder" && !editing && (
              <Tooltip text="create File" position="right" delay={0}>
                <PlusCircleIcon 
                size={15}
                className="hover:dark:text-white dark:text-neutral-700 " />
              </Tooltip>
            )}
          </div>
        </div>
      </AccordionTrigger>
    </AccordionItem>
  );
};

export default DropDown;
