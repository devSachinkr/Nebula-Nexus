"use client";
import { useQuillEditor } from "@/lib/providers/quill-editor-provider";
import { useAppState } from "@/lib/providers/state-provider";
import { FILES, WORKSPACE, FOLDER } from "@/types/supabase";
import {
  SUPABASE_FILE,
  SUPABASE_FOLDER,
  SUPABASE_WORKSPACE,
} from "@/types/supabase-type";
import React from "react";
import { Button } from "../ui/button";
import Tooltip from "../global/tool-tip";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import Loader from "../global/loader";
import Image from "next/image";
import Emoji from "../global/emoji-picker";

type Props = {
  type: "workspace" | "folder" | "file";
  quillDetails: SUPABASE_FILE | SUPABASE_FOLDER | SUPABASE_WORKSPACE;
  quillId: string;
};
const QuillEditor = ({ quillDetails, quillId, type }: Props) => {
  const {
    wrapperRef,
    details,
    restoreTrash,
    deleteFile,
    breadCrumbs,
    collaborators,
    loading,
    bannerUrl,
    iconChange,
  } = useQuillEditor();
  console.log(breadCrumbs);
  return (
    <>
      <div className="relative">
        {
          // @ts-ignore
          details?.inTrash && (
            <article className="py-2 bg-[#EB5757] flex md:flex-row flex-col justify-center items-center gap-4 flex-wrap">
              <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
                <span className="text-white">This {type} is in the trash.</span>
                <Button
                  size={"sm"}
                  variant={"outline"}
                  className="bg-transparent border-white text-white hover:bg-white hover:text-[#EB5757]"
                  onClick={restoreTrash}
                >
                  Restore
                </Button>
                <Button
                  size={"sm"}
                  variant={"outline"}
                  className="bg-transparent border-white text-white hover:bg-white hover:text-[#EB5757]"
                  onClick={deleteFile}
                >
                  Delete
                </Button>
              </div>
              <span className="text-sm text-white">
                {
                  // @ts-ignore
                  details.inTrash
                }
              </span>
            </article>
          )
        }
        {details?.in_trash && (
          <article className="py-2 bg-[#EB5757] flex md:flex-row flex-col justify-center items-center gap-4 flex-wrap">
            <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
              <span className="text-white">This {type} is in the trash.</span>
              <Button
                size={"sm"}
                variant={"outline"}
                className="bg-transparent border-white text-white hover:bg-white hover:text-[#EB5757]"
                onClick={restoreTrash}
              >
                Restore
              </Button>
              <Button
                size={"sm"}
                variant={"outline"}
                className="bg-transparent border-white text-white hover:bg-white hover:text-[#EB5757]"
                onClick={deleteFile}
              >
                Delete
              </Button>
            </div>
            <span className="text-sm text-white">{details.in_trash}</span>
          </article>
        )}
      </div>
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between justify-center sm:items-center sm:p-2 p-8">
        {breadCrumbs}
        {collaborators?.map((c) => (
          <div className="flex items-center gap-4 " key={c.id}>
            <div className="flex items-center justify-center h-10">
              <Tooltip text={"User"}>
                <Avatar className="-ml-3 bg-background  border-[2px] border-green-500  h-8 w-8 rounded-full">
                  <AvatarImage className="rounded-full" src={c?.avatar_url} />
                  <AvatarFallback>
                    {c.email.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Tooltip>
            </div>
          </div>
        ))}
        {loading ? (
          <Badge
            variant={"secondary"}
            className="bg-orange-500 top-4 text-white right-4 z-50 w-16"
          >
            <Loader />
          </Badge>
        ) : (
          <Badge
            variant={"secondary"}
            className="bg-green-600 w-16 text-center top-4 text-white right-4 z-50 "
          >
            Saved
          </Badge>
        )}
      </div>
      {details?.banner_url && (
        <div className="w-full relative h-[200px]">
          <Image
            src={bannerUrl || ""}
            alt={"Banner Image"}
            fill
            className="w-full md:h-48 h-20 object-cover "
          />
        </div>
      )}

      {/* text-editor */}
      <div className="flex items-center justify-center flex-col relative mt-2">
        <div className="w-full self-center max-w-[800px] flex flex-col px-7 lg:my-8">
          <div className="text-[80px]">
            <Emoji getValue={iconChange}>
              <div className="w-[100px] cursor-pointer transition-colors h-[100px] flex items-center justify-center hover:bg-muted rounded-xl">
                {
                  // @ts-ignore
                  details?.icon_id || details?.iconId || ""
                }
              </div>
            </Emoji>
          </div>
        </div>
        <div
          id="container"
          ref={wrapperRef}
          className="max-w-[800px] m-auto"
        ></div>
      </div>
    </>
  );
};

export default QuillEditor;
