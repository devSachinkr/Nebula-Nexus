import { getFolderDetails, getFolders } from "@/actions/folder";
import { getWorkspace } from "@/actions/workspace";
import QuillEditor from "@/components/editor/quill-editor";
import { QuillProvider } from "@/lib/providers/quill-editor-provider";
import { SUPABASE_FOLDER, SUPABASE_WORKSPACE } from "@/types/supabase-type";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    workspaceId: string;
    folderId: string;
  };
};

const page = async ({ params: { workspaceId, folderId } }: Props) => {
  const { data, error } = await getFolderDetails(folderId);
  if (error) {
    redirect("/dashboard");
  }

  return (
    <QuillProvider
      type="folder"
      quillDetails={data}
      quillId={workspaceId}
      fileId={folderId}
    >
      <div className="relative">
        <QuillEditor type="folder" quillId={workspaceId} quillDetails={data} />
      </div>
    </QuillProvider>
  );
};

export default page;
