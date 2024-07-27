"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { v4 } from "uuid";
import { workspaceFormSchema } from "@/types/schema";
import { WORKSPACE } from "@/types/supabase";
import ToastNotify from "@/components/global/ToastNotify";
import { createWorkspace } from "@/actions/workspace";
import { AuthUser } from "@supabase/supabase-js";
import { useAppState } from "@/lib/providers/state-provider";
import { createClient } from "@/lib/supabase/supabase-client";
export const useWorkspace = ({ user }: { user: AuthUser }) => {
  const [selectedEmoji, setSelectedEmoji] = useState("🏡");
  console.log(selectedEmoji);
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
