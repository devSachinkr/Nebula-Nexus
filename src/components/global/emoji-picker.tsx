"use client";
import React from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Popover, PopoverTrigger } from "../ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
type Props = {
  children: React.ReactNode;
  getValue?: (emoji: string) => void;
};

const Emoji = ({ children, getValue }: Props) => {
  const router = useRouter();
  const Picker = dynamic(() => import("emoji-picker-react"));
  const onCLick = (selectedEmoji: any) => {
    if (getValue) getValue(selectedEmoji.emoji);
  };
  return (
    <div className="flex items-center z-[11111]">
      <Popover>
        <PopoverTrigger  className="cursor-pointer">{children}</PopoverTrigger>
        <PopoverContent  side="top" className="p-0 border-none">
          <Picker onEmojiClick={onCLick}  />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Emoji;
