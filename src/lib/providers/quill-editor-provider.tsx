"use client";
import "quill/dist/quill.snow.css";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useAppState } from "./state-provider";
import { TOOLBAR_OPTIONS } from "../utils";
import {
  SUPABASE_FILE,
  SUPABASE_FOLDER,
  SUPABASE_WORKSPACE,
} from "@/types/supabase-type";
import { deleteFiles, upsertFile } from "@/actions/file";
import ToastNotify from "@/components/global/ToastNotify";
import { useRouter } from "next/navigation";
import { deleteFolder, upsertFolder } from "@/actions/folder";

interface QuillContext {
  wrapperRef: (wrapper: any) => void;
  details: SUPABASE_FILE | SUPABASE_FOLDER | SUPABASE_WORKSPACE | null;
  restoreTrash: () => void;
  deleteFile: () => void;
}

interface QuillProvider {
  children: React.ReactNode;
  type: "workspace" | "folder" | "file";
  quillDetails: SUPABASE_FILE | SUPABASE_FOLDER | SUPABASE_WORKSPACE;
  quillId: string;
  fileId?: string;
}
const initialValue: QuillContext = {
  wrapperRef: (wrapper: any) => {},
  restoreTrash: () => {},
  deleteFile: () => {},
  details: null,
};

const QuillContext = createContext<QuillContext>(initialValue);

export const QuillProvider: React.FC<QuillProvider> = ({
  children,
  quillDetails,
  quillId,
  type,
  fileId,
}) => {
  const [quill, setQuill] = useState<any>(null);
  const { dispatch, folderId, state, workspaceId } = useAppState();
  const router = useRouter();
  const restoreTrash = async () => {
    if (type === "file") {
      if (!folderId || !workspaceId || !fileId) return;
      dispatch({
        type: "UPDATE_FILE",
        payload: {
          workspaceId,
          folderId,
          fileId,
          file: {
            in_trash: "",
          },
        },
      });
      const { error } = await upsertFile({
        ...state.workspaces
          .find((w) => w.id === workspaceId)
          ?.folders.find((f) => f.id === folderId)
          ?.files.find((file) => file.id === fileId),
        in_trash: "",
      });

      if (error) {
        ToastNotify({
          title: "Oops!",
          msg: `Failed File couldn't restore from trash. Error: ${error}`,
        });
        return;
      }
      ToastNotify({
        title: "Success",
        msg: `File has been restored from trash`,
      });
      router.refresh();
    } else if (type === "folder") {
      if (!folderId || !workspaceId || !fileId) return;
      dispatch({
        type: "UPDATE_FOLDER",
        payload: {
          workspaceId,
          folderId: fileId,
          folder: {
            inTrash: "",
          },
        },
      });
      const { error } = await upsertFolder({
        ...state.workspaces
          .find((w) => w.id === workspaceId)
          ?.folders.find((f) => f.id === folderId),
        inTrash: "",
      });
      if (error) {
        ToastNotify({
          title: "Oops!",
          msg: `Failed Folder couldn't restore from trash. Error`,
        });
        return;
      }
      ToastNotify({
        title: "Success",
        msg: `Folder has been restored from trash`,
      });
      router.refresh();
    }
  };
  const deleteFile = async () => {
    if (type === "file") {
      if (!folderId || !workspaceId || !fileId) return;
      dispatch({
        type: "DELETE_FILE",
        payload: {
          workspaceId,
          folderId,
          fileId,
        },
      });
      const { error } = await deleteFiles(fileId);
      if (error) {
        ToastNotify({
          title: "Oops!",
          msg: `Failed File couldn't be deleted. Error: ${error}`,
        });
        return;
      }
      ToastNotify({
        title: "Success",
        msg: `File has been deleted`,
      });
      router.refresh();
    } else if (type === "folder") {
      if (!folderId || !workspaceId || !fileId) return;
      dispatch({
        type: "DELETE_FOLDER",
        payload: {
          workspaceId,
          folderId: fileId,
        },
      });
      const { error } = await deleteFolder(fileId);
      if (error) {
        ToastNotify({
          title: "Oops!",
          msg: `Failed Folder couldn't be deleted. Error: ${error}`,
        });
        return;
      }
      ToastNotify({
        title: "Success",
        msg: `Folder has been deleted`,
      });
      router.refresh();
    }
  };

  const details = useMemo(() => {
    let selectedQuillDetails: any;
    switch (type) {
      case "workspace":
        selectedQuillDetails = state.workspaces.find(
          (w) => w.id === workspaceId
        );
        break;
      case "folder":
        selectedQuillDetails = state.workspaces
          .find((w) => w.id === workspaceId)
          ?.folders.find((folder) => folder.id === folderId);
        break;

      case "file":
        selectedQuillDetails = state.workspaces
          .find((w) => w.id === workspaceId)
          ?.folders.find((folder) => folder.id === folderId)
          ?.files.find((file) => file.id === fileId);
        break;
    }
    if (selectedQuillDetails) {
      return selectedQuillDetails;
    }
    return {
      title: quillDetails.title,
      icon_id: quillDetails.icon_id,
      created_at: quillDetails.created_at,
      data: quillDetails.data,
      in_trash: quillDetails.in_trash,
      banner_url: quillDetails.banner_url,
    };
  }, [state, folderId, workspaceId]);

  const wrapperRef = useCallback(async (wrapper: any) => {
    if (typeof window !== "undefined") {
      if (wrapper === null) return;
      wrapper.innerHTML = "";
      const editor = document.createElement("div");
      wrapper.append(editor);
      const Quill = (await import("quill")).default;
      const q = new Quill(editor, {
        theme: "snow",
        modules: {
          toolbar: TOOLBAR_OPTIONS,
        },
      });
      setQuill(q);
    }
  }, []);

  const value: QuillContext = {
    wrapperRef,
    details,
    restoreTrash,
    deleteFile,
  };
  return (
    <QuillContext.Provider value={value}>{children}</QuillContext.Provider>
  );
};

export const useQuillEditor = () => {
  const context = useContext(QuillContext);
  if (!context) {
    throw new Error("useQuillEditor must be used within a QuillProvider");
  }

  return context;
};
