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
import { usePathname, useRouter } from "next/navigation";
import { deleteFolder, upsertFolder } from "@/actions/folder";
import { createClient } from "../supabase/supabase-client";
import { updateWorkspace } from "@/actions/workspace";

interface QuillContext {
  wrapperRef: (wrapper: any) => void;
  details: SUPABASE_FILE | SUPABASE_FOLDER | SUPABASE_WORKSPACE | null;
  restoreTrash: () => void;
  deleteFile: () => void;
  breadCrumbs: string | undefined;
  collaborators:
    | {
        id: string;
        email: string;
        avatar_url: string;
      }[]
    | undefined;
  loading: boolean;
  bannerUrl: string | undefined;
  iconChange: (emoji: string) => void;
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
  breadCrumbs: undefined,
  collaborators: undefined,
  loading: false,
  bannerUrl: undefined,
  iconChange: (emoji: string) => {},
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
  const [bannerImage, setBannerImage] = useState<string>("");
  const [collaborators, setCollaborators] = useState<
    | {
        id: string;
        email: string;
        avatar_url: string;
      }[]
    | undefined
  >(undefined);
  const [loading, setLoading] = useState<false>(false);
  const router = useRouter();
  const pathName = usePathname();
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
        workspace_id: workspaceId,
        folder_id: folderId,
        id: fileId,
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
      router.replace("/dashboard");
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
      router.replace("/dashboard");
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

  const breadCrumbs = useMemo(() => {
    if (!pathName || !state.workspaces || !workspaceId) return;

    const segments = pathName
      .split("/")
      .filter((val) => val !== "dashboard" && val);
    const workspaceDetails = state.workspaces.find((w) => w.id === workspaceId);
    const workspaceBreadCrumb = workspaceDetails
      ? `${workspaceDetails.iconId} ${workspaceDetails.title}`
      : "";
    if (segments.length === 1) {
      return workspaceBreadCrumb;
    }

    const folderSegment = segments[1];
    const folderDetails = workspaceDetails?.folders.find(
      (f) => f.id === folderSegment
    );
    const folderBreadCrumb = folderDetails
      ? `/ ${folderDetails.iconId} ${folderDetails.title}`
      : "";
    if (segments.length === 2) {
      return `${workspaceBreadCrumb} ${folderBreadCrumb}`;
    }
    const folder = state.workspaces
      .find((w) => w.id === workspaceId)
      ?.folders.find((folder) => folder.id === folderId);

    const folderBread = folder ? `/ ${folder.iconId} ${folder.title}` : "";
    const fileSegment = segments[2];
    const fileDetails = state.workspaces
      .find((w) => w.id === workspaceId)
      ?.folders.find((folder) => folder.id === folderId)
      ?.files.find((file) => file.id === fileSegment);
    const fileBreadCrumb = fileDetails
      ? ` / ${fileDetails.icon_id} ${fileDetails.title}`
      : "";
    return `${workspaceBreadCrumb} ${folderBread} ${fileBreadCrumb}`;
  }, [state, pathName, workspaceId]);

  const bannerUrl: string | undefined = useMemo(() => {
    if (!quillDetails.banner_url) return "";
    const supabase = createClient();
    try {
      const { data } = supabase.storage
        .from("banner-images")
        .getPublicUrl(quillDetails.banner_url);
      if (data) {
        return data.publicUrl;
      }
      return "";
    } catch (error) {
      console.log(error);
      return;
    }
  }, [quillDetails, state]);

  const iconChange = async (emoji: string) => {
    if (!workspaceId || !folderId) return;
    if (type === "workspace") {
      dispatch({
        type: "UPDATE_WORKSPACE",
        payload: {
          workspaceId,
          workspace: {
            iconId: emoji,
          },
        },
      });
      const res = await updateWorkspace({
        iconId: emoji,
        id: workspaceId,
      });
      if (res?.error) {
        ToastNotify({
          title: "Oops!",
          msg: `Failed to update workspace icon. Error`,
        });
        return;
      }
      ToastNotify({
        title: "Success",
        msg: `Workspace icon has been updated to ${emoji}`,
      });
    } else if (type === "file") {
      if (!fileId) return;
      dispatch({
        type: "UPDATE_FILE",
        payload: {
          workspaceId,
          folderId,
          fileId,
          file: {
            icon_id: emoji,
          },
        },
      });
      const { error } = await upsertFile({
        icon_id: emoji,
        ...state.workspaces
          .find((w) => w.id === workspaceId)
          ?.folders.find((folder) => folder.id === folderId)
          ?.files.find((file) => file.id === fileId),

        workspace_id: workspaceId,
        folder_id: folderId,
        id: fileId,
      });
      if (error) {
        console.log(error);
        ToastNotify({
          title: "Oops!",
          msg: "Failed to update file icon Error",
        });
        return;
      }
      ToastNotify({
        title: "Success",
        msg: `File icon has been changed to ${emoji}`,
      });
    } else if (type === "folder") {
      dispatch({
        type: "UPDATE_FOLDER",
        payload: {
          workspaceId,
          folderId,
          folder: {
            iconId: emoji,
          },
        },
      });
      const res = await upsertFolder({
        ...state.workspaces
          .find((w) => w.id === workspaceId)
          ?.folders.find((f) => f.id === folderId),
        iconId: emoji,
      });
      if (res?.error) {
        ToastNotify({
          title: "Oops!",
          msg: `Failed to update folder icon. Error`,
        });
        return;
      }
      ToastNotify({
        title: "Success",
        msg: `Folder icon has been updated to ${emoji}`,
      });
    }
  };
  const value: QuillContext = {
    wrapperRef,
    details,
    restoreTrash,
    deleteFile,
    breadCrumbs,
    collaborators,
    loading,
    bannerUrl,
    iconChange,
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
