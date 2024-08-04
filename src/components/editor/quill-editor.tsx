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

type Props = {
  type: "workspace" | "folder" | "file";
  quillDetails: SUPABASE_FILE | SUPABASE_FOLDER | SUPABASE_WORKSPACE;
  quillId: string;
};
const QuillEditor = ({ quillDetails, quillId, type }: Props) => {
  const { wrapperRef, details, restoreTrash, deleteFile } = useQuillEditor();
  return (
    <>
      <div className="relative">
        {details?.in_trash && (
          <article className="py-2 bg-[#EB5757] flex md:flex-row flex-col justify-center items-center gap-4 flex-wrap">
            <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
              <span className="text-white">This{type} is in the trash.</span>
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
          </article>
        )}
      </div>
      <div className="flex items-center justify-center flex-col relative mt-2">
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
