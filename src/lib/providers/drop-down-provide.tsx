"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/supabase-client";
import { useAppState } from "./state-provider";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { upsertFolder } from "@/actions/folder";
import ToastNotify from "@/components/global/ToastNotify";
import { FILES } from "@/types/supabase";
import { v4 } from "uuid";
import { SUPABASE_FILE } from "@/types/supabase-type";
import { getFiles, upsertFile } from "@/actions/file";
import { useSupabaseUser } from "./user-provider";
type DropdownContext = {
  style: string;
  navigatePage: (id: string, listType: DropdownProvider["listType"]) => void;
  identified: string;
  emojiHandler: (emoji: string) => void;
  editing: boolean;
  loading: boolean;
  folderTitle: string | undefined;
  handleDoubleClick: () => void;
  handleBlur: () => void;
  folderTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileTitle: string | undefined;
  fileTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addFile: () => void;
  moveTrash: () => void;
};
type DropdownProvider = {
  children: React.ReactNode;
  listType: "folder" | "file" | "native";
  folderId: string;
  title: string;
};
const initialValue: DropdownContext = {
  style: "",
  navigatePage: (id: string, listType: DropdownProvider["listType"]) => {},
  identified: "",
  emojiHandler: () => {},
  editing: false,
  loading: false,
  folderTitle: undefined,
  handleDoubleClick: () => {},
  handleBlur: () => {},
  folderTitleChange: () => {},
  fileTitle: "",
  fileTitleChange: () => {},
  addFile: () => {},
  moveTrash: () => {},
};
const DropdownContext = createContext<DropdownContext>(initialValue);
export const DropDownProvider: React.FC<DropdownProvider> = ({
  children,
  listType,
  title,
  folderId,
}) => {
  const { dispatch, state, workspaceId } = useAppState();
  const { user } = useSupabaseUser();
  const [editing, setEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  //   Custom styles
  const isFolder = listType === "folder";
  const style = useMemo(
    () =>
      clsx("relative", {
        "border-none text-md ": isFolder,
        "border-none ml-6 text-[16px] py-1": !isFolder,
      }),
    [isFolder]
  );
  const identified = useMemo(
    () =>
      clsx(
        "dark:text-white whitespace-nowrap flex justify-between items-center w-full  relative",
        {
          "group/folder": isFolder,
          "group/file": !isFolder,
        }
      ),
    [isFolder]
  );

  // Page Navigation
  const navigatePage = (
    accordionId: string,
    listType: DropdownProvider["listType"]
  ) => {
    if (listType === "folder") {
      router.push(`/dashboard/${workspaceId}/${accordionId}`);
    }
    if (listType === "file") {
      console.log(accordionId)
      router.push(
        `/dashboard/${workspaceId}/${folderId}/${
          accordionId.split("folder")[1]
        }`
      );
    }
  };
  // Emoji handler
  const emojiHandler = async (emoji: string) => {
    if (listType === "folder") {
      if (!workspaceId || !folderId) return;
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
    }
    setLoading(true);
    const { error } = await upsertFolder({
      iconId: emoji,
      workspaceId,
      title:
        state.workspaces
          .find((w) => w.id === workspaceId)
          ?.folders.find((f) => f.id === folderId)?.title || "Untitled",
      id: folderId,
      createdAt: new Date().toISOString(),
    });
    if (error) {
      console.log(error);
      ToastNotify({
        title: "Success",
        msg: `Failed to update folder icon. Error: ${error}`,
      });
      setLoading(false);
      return;
    }
    ToastNotify({
      title: "Success",
      msg: `Folder icon was changed to ${emoji}`,
    });
    router.refresh();
    setLoading(false);
  };
  // Assigning title
  const folderTitle: string | undefined = useMemo(() => {
    if (listType === "folder") {
      const stateTitle = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === folderId)?.title;
      if (title === stateTitle || !stateTitle) return title;
      return stateTitle;
    }
  }, [state, listType, workspaceId, folderId, title]);
  const fileTitle: string | undefined = useMemo(() => {
    if (listType === "file") {
      const fileAndFolderId = folderId.split("folder");
      const stateTitle = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === fileAndFolderId[0])
        ?.files.find((file) => file?.id === fileAndFolderId[1])?.title;
      if (title === stateTitle || !stateTitle) return title;
      return stateTitle;
    }
  }, [state, listType, workspaceId, folderId, title]);

  // handle Double click
  const handleDoubleClick = () => {
    setEditing(true);
  };
  // handle blur
  const handleBlur = async () => {
    if (!editing) return;
    setEditing(false);
    const fId = folderId.split("folder");

    if (fId.length === 1) {
      if (!folderTitle) return;
      const { error } = await upsertFolder({
        createdAt: new Date().toISOString(),
        id: fId[0],
        workspaceId,
        iconId:
          state.workspaces
            .find((w) => w.id === workspaceId)
            ?.folders.find((f) => f.id === fId[0])?.iconId || "📁",
        title,
      });
      if (error) {
        console.log(error);
        ToastNotify({
          title: "Oops!",
          msg: `Failed to update folder title. Error`,
        });
      }
      ToastNotify({
        title: "Success",
        msg: `Folder title was updated ${title}`,
      });
    }
    if (fId.length === 2 && fId[1]) {
      if (!fileTitle) return;
      const { error } = await upsertFile({
        created_at: new Date().toISOString(),
        id: fId[1],
        workspace_id: workspaceId!,
        title: title,
        folder_id: fId[0],
      });
      if (error) {
        console.log(error);
        ToastNotify({
          title: "Oops!",
          msg: `Failed to update file title. Error`,
        });
        return;
      }
      ToastNotify({
        title: "Success",
        msg: `File title was updated ${title}`,
      });
    }
  };
  //   change Folder Title

  const folderTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (title === e.target.value) {
      return;
    }
    const fId = folderId.split("folder");
    if (fId.length === 1) {
      if (!workspaceId) return;
      dispatch({
        type: "UPDATE_FOLDER",
        payload: {
          workspaceId,
          folderId: fId[0],
          folder: {
            title: e.target.value,
          },
        },
      });
    }
  };
  //   change File Title
  const fileTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fId = folderId.split("folder");

    if (fId.length === 2 && fId[1]) {
      if (!workspaceId || !folderId) return;
      dispatch({
        type: "UPDATE_FILE",
        payload: {
          workspaceId,
          folderId: fId[0],
          file: {
            title: e.target.value,
          },
          fileId: fId[1],
        },
      });
    }
  };

  // Add new File
  const addFile = async () => {
    if (!workspaceId || !folderId)
      throw new Error("Workspace ID or folder ID might not be specified!");

    const payload: SUPABASE_FILE = {
      banner_url: "",
      created_at: new Date().toISOString(),
      data: null,
      folder_id: folderId,
      workspace_id: workspaceId,
      in_trash: null,
      id: v4(),
      icon_id: "📄",
      title: "Untitled",
    };
    dispatch({
      type: "ADD_FILE",
      payload: { file: payload, workspaceId, folderId },
    });

    const { error } = await upsertFile(payload);
    if (error) {
      console.log(error);
      ToastNotify({
        title: "Oops!",
        msg: `Failed to add file. Error: ${error}`,
      });
      return;
    }
    ToastNotify({
      title: "Success",
      msg: `File added successfully! ${payload.title}`,
    });
    router.refresh();
  };
  //  Move Trash
  const moveTrash = async () => {
    if (!user || !workspaceId) return;
    const id = folderId.split("folder");
    if (listType === "folder") {
      dispatch({
        type: "UPDATE_FOLDER",
        payload: {
          workspaceId,
          folderId: id[0],
          folder: {
            inTrash: `Folder Deleted By ${user.email}`,
          },
        },
      });
      const { error } = await upsertFolder({
        ...state.workspaces
          .find((w) => w.id === workspaceId)
          ?.folders.find((f) => f.id === id[0]),
        inTrash: `Deleted By ${user.email}`,
      });
      if (error) {
        console.log(error);
        ToastNotify({
          title: "Oops!",
          msg: `Failed Folder couldn't move to trash. Error: ${error}`,
        });
        return;
      }
      ToastNotify({
        title: "Success",
        msg: `Folder moved to trash! `,
      });
      router.refresh();
    } else if (listType === "file") {
      dispatch({
        type: "UPDATE_FILE",
        payload: {
          workspaceId,
          folderId: id[0],
          file: {
            in_trash: `Deleted By ${user.email}`,
          },
          fileId: id[1],
        },
      });
      const { error } = await upsertFile({
        ...state.workspaces
          .find((w) => w.id === workspaceId)
          ?.folders.find((f) => f.id === id[0])
          ?.files.find((file) => file.id === id[1]),
        in_trash: `Deleted By ${user.email}`,
      });
      if (error) {
        console.log(error);
        ToastNotify({
          title: "Oops!",
          msg: `Failed File couldn't move to trash. Error: ${error}`,
        });
        return;
      }
      ToastNotify({
        title: "Success",
        msg: `File moved to trash! `,
      });
      router.refresh();
    }
  };
  // return value
  const value: DropdownContext = {
    style,
    navigatePage,
    identified,
    emojiHandler,
    editing,
    loading,
    folderTitle,
    handleDoubleClick,
    handleBlur,
    folderTitleChange,
    fileTitle,
    fileTitleChange,
    addFile,
    moveTrash,
  };
  return (
    <DropdownContext.Provider value={value}>
      {children}
    </DropdownContext.Provider>
  );
};

export const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context)
    throw new Error("useDropDown hook must  be  use with DropdownProvider");
  return context;
};
