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
  console.log(fileId)
  const { data, error } = await getFileDetails(fileId);
  if (error) {
    redirect("/dashboard");
  }

  return (
    <QuillProvider
      type="file"
      quillDetails={data}
      quillId={workspaceId}
      fileId={fileId}
    >
      <div className="relative">
        <QuillEditor
          type="file"
          quillId={workspaceId}
          quillDetails={data}
        />
      </div>
    </QuillProvider>
  );
};

export default page;
