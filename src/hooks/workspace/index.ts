"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { v4 } from "uuid";
import { workspaceFormSchema } from "@/types/schema";
import { USER, WORKSPACE } from "@/types/supabase";
import ToastNotify from "@/components/global/ToastNotify";
import { createWorkspace, getPrivateWorkspaces } from "@/actions/workspace";
import { AuthUser } from "@supabase/supabase-js";
import { useAppState } from "@/lib/providers/state-provider";
import { createClient } from "@/lib/supabase/supabase-client";
import { useSupabaseUser } from "@/lib/providers/user-provider";
import { addCollaborators } from "@/actions/collaborators";
import { useModal } from "@/lib/providers/modal-provider";

export const useWorkspace = ({ user }: { user: AuthUser }) => {
  const [selectedEmoji, setSelectedEmoji] = useState("🏡");
  const { dispatch } = useAppState();
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<z.infer<typeof workspaceFormSchema>>({
    mode: "onChange",
    defaultValues: { workspaceLogo: "", workspaceName: "" },
  });

  const onSubmit = handleSubmit(
    async ({
      workspaceName,
      workspaceLogo,
    }: z.infer<typeof workspaceFormSchema>) => {
      const file = workspaceLogo?.[0];
      console.log(file);
      let fileUrl = null;
      if (file) {
        try {
          const supabase = createClient();
          const { data, error } = await supabase.storage
            .from("nebula-workspace")
            .upload(`workspaceImage.${v4()}`, file, {
              cacheControl: "3600",
              upsert: true,
            });
          if (error) {
            throw new Error("Failed to upload file");
          }
          fileUrl = data?.path;
        } catch (error) {
          console.log(error);
          ToastNotify({
            title: "Oops!",
            msg: "Failed to upload file",
          });
        }
      }
      const payload: WORKSPACE = {
        data: null,
        bannerUrl: "",
        createdAt: new Date().toISOString(),
        iconId: selectedEmoji,
        id: v4(),
        inTrash: "",
        title: workspaceName,
        workspaceOwner: user.id,
        logo: fileUrl ?? null,
      };
      try {
        const { error } = await createWorkspace(payload);
        if (error) {
          throw new Error("Failed to create workspace");
        }
        dispatch({
          type: "ADD_WORKSPACE",
          payload: { ...payload, folders: [] },
        });
        ToastNotify({
          title: "Success",
          msg: `${payload.title} has been created successfully`,
        });
        router.push(`dashboard/${payload.id}`);
      } catch (error) {
        console.log(error);
      } finally {
        reset();
      }
    }
  );

  useEffect(() => {
    selectedEmoji && setSelectedEmoji(selectedEmoji);
  }, [selectedEmoji]);
  return {
    selectedEmoji,
    setSelectedEmoji,
    handleSubmit,
    register,
    isSubmitting,
    errors,
    onSubmit,
  };
};

export const useWorkspaceForm = ({
  defaultValue,
}: {
  defaultValue: WORKSPACE | undefined;
}) => {
  const { user } = useSupabaseUser();
  const { setClose } = useModal();
  const [permission, setPermission] = useState<"private" | "shared">("private");
  const [title, setTitle] = useState("");
  const [collaborators, setCollaborators] = useState<USER[]>([]);
  const [loading, SetLoading] = useState<boolean>(false);
  const router = useRouter();
  const addCollaborator = (user: USER) => {
    setCollaborators([...collaborators, user]);
  };
  const removeCollaborator = (user: USER) => {
    setCollaborators(collaborators.filter((c) => c.id !== user.id));
  };
  const handleSubmit = async () => {
    SetLoading(true);
    if (user?.id) {
      const payload: WORKSPACE = {
        id: v4(),
        data: null,
        iconId: "🏡",
        inTrash: "",
        workspaceOwner: user.id,
        title,
        logo: null,
        bannerUrl: "",
        createdAt: new Date().toISOString(),
      };
      if (permission === "private") {
        await createWorkspace(payload);
        router.refresh();
      }
      if (permission === "shared") {
        await createWorkspace(payload);
        await addCollaborators(collaborators, payload.id);
        router.refresh();
      }
    }
    SetLoading(false);
    ToastNotify({
      title: "Success",
      msg: "Workspace created successfully",
    });

    setClose();
    router.refresh();
  };
  return {
    permission,
    setPermission,
    title,
    collaborators,
    user,
    addCollaborator,
    removeCollaborator,
    setTitle,
    handleSubmit,
    loading,
  };
};
