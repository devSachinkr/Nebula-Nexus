import { getFileDetails } from "@/actions/file";

import QuillEditor from "@/components/editor/quill-editor";
import { QuillProvider } from "@/lib/providers/quill-editor-provider";
import { redirect } from "next/navigation";

type Props = {
  params: {
    fileId: string;
    workspaceId: string;
  };
};

const page = async ({ params: { fileId, workspaceId } }: Props) => {
  const fileID = fileId.split("folder")[1];

  const { data, error } = await getFileDetails(fileID);
  if (error) {
    redirect("/dashboard");
  }

  return (
    <QuillProvider
      type="file"
      quillDetails={data}
      quillId={workspaceId}
      fileId={fileID}
    >
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
