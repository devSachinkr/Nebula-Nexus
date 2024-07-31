"use client";
import { useModal } from "@/lib/providers/modal-provider";
import { Home, Settings as SettingIcon, Trash, Trash2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";
import CustomModal from "../global/custom-modal";

type Props = {
  workspaceId: string;
  className: string;
};

const Navigation = ({ className, workspaceId }: Props) => {
  const { setOpen } = useModal();
  return (
    <nav className={twMerge("my-2", className)}>
      <ul className="flex flex-col gap-2">
        <li>
          <Link
            className="group/native
                flex
                text-Neutrals/neutrals-7
                transition-all
                gap-2
              "
            href={`/dashboard/${workspaceId}`}
          >
            <Home />
            <span>My Workspace</span>
          </Link>
        </li>

        <li
          className="group/native
                flex
                text-Neutrals/neutrals-7
                transition-all
                gap-2
                cursor-pointer
              "
              onClick={() =>
                setOpen(
                  <CustomModal title="Settings">
                    <div>hlo</div>
                  </CustomModal>
                )
              }
        >
          <SettingIcon
           
          />
          <span>Settings</span>
        </li>

        <li
          className="group/native
                flex
                text-Neutrals/neutrals-7
                transition-all
                gap-2
                 cursor-pointer
              "
        >
          <Trash2 />
          <span>Trash</span>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
