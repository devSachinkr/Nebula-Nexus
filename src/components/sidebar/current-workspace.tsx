"use client";
import { useCurrentWorkspace } from "@/hooks/sidebar";
import { WORKSPACE } from "@/types/supabase";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Typography from "../global/typography";
import Loader from "../global/loader";

type Props = {
  workspace: WORKSPACE;
  select?: (opt: WORKSPACE) => void;
};

const CurrentWorkspace = ({ select, workspace }: Props) => {
  const { workspaceLogo } = useCurrentWorkspace({ workspace });
  return (
    <Link
      href={`/dashboard/${workspace.id}`}
      onClick={() => {
        if (select) select(workspace);
      }}
      className={
        "flex rounded-md hover:bg-muted transition-all flex-row p-2 pl-4 gap-3 justify-center cursor-pointer items-center my-2 "
      }
    >
      <Image
        src={workspaceLogo}
        alt="workspace logo"
        width={26}
        height={26}
        objectFit="cover"
      />

      <div className="flex flex-col">
        <Typography
          text={workspace.title}
          variant="h3"
          className="text-lg w-[170px]  overflow-hidden overflow-ellipsis whitespace-nowrap"
        />
      </div>
    </Link>
  );
};

export default CurrentWorkspace;
