"use client";

import { upsertFolder } from "@/actions/folder";
import ToastNotify from "@/components/global/ToastNotify";
import { useAppState } from "@/lib/providers/state-provider";
import { useSupabaseUser } from "@/lib/providers/user-provider";
import { FOLDER } from "@/types/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 } from "uuid";

export const useFolder = ({
  workspaceId,
  workspaceFolder,
}: {
  workspaceId: string;
  workspaceFolder: FOLDER[] | null;
}) => {
  const router = useRouter();
  const { dispatch, state, folderId } = useAppState();
  const [folders, setFolder] = useState<FOLDER[] | null>(workspaceFolder);
  const { subscription } = useSupabaseUser();
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (workspaceFolder?.length) {
      dispatch({
        type: "SET_FOLDER",
        payload: {
          workspaceId,
          folders: workspaceFolder.map((folder) => ({
            ...folder,
            files:
              state.workspaces
                .find((w) => w.id === workspaceId)
                ?.folders.find((f) => f.id === folder.id)?.files || [],
          })),
        },
      });
    }
  }, [workspaceFolder, workspaceId]);

  useEffect(() => {
    setFolder(
      state.workspaces.find((w) => w.id === workspaceId)?.folders || []
    );
  }, [state]);
  const addFolder = async () => {
    setLoading(true);
    if (folders?.length! >= 3 && !subscription) {
      ToastNotify({
        title: "Oops!",
        msg: "You have reached the maximum number of folders. Please subscribe a  plan to unlock more than 3 folders. ",
      });
      return;
    }
    const payload: FOLDER = {
      data: null,
      createdAt: new Date().toISOString(),
      id: v4(),
      title: "Untitled",
      workspaceId,
      bannerUrl: "",
      iconId: "📁",
      inTrash: null,
    };

    dispatch({
      type: "ADD_FOLDER",
      payload: { workspaceId, folder: { ...payload, files: [] } },
    });

    const { error } = await upsertFolder(payload);

    if (error) {
      console.log(error);
      ToastNotify({
        title: "Oops!",
        msg: `Failed to create folder`,
      });
      setLoading(false);
      return;
    }
    ToastNotify({
      title: "Success",
      msg: `${payload.title} was created successfully`,
    });
    setLoading(false);

    router.refresh();
  };
  return { addFolder, folders, folderId };
};
