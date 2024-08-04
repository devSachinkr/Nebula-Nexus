import { getWorkspace } from "@/actions/workspace";
import QuillEditor from "@/components/editor/quill-editor";
import { QuillProvider } from "@/lib/providers/quill-editor-provider";
import { SUPABASE_WORKSPACE } from "@/types/supabase-type";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    workspaceId: string;
  };
};

const page = async ({ params: { workspaceId } }: Props) => {
  const { data, error } = await getWorkspace(workspaceId);
  if (error) {
    redirect("/dashboard");
  }
  console.log(data);
  return (
    <QuillProvider type="workspace" quillDetails={data} quillId={workspaceId}>
      <div className="relative">
        <QuillEditor
          type="workspace"
          quillId={workspaceId}
          quillDetails={data}
        />
      </div>
    </QuillProvider>
  );
};

export default page;
