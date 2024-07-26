"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { workspaceFormSchema } from "@/types/schema";
import { WORKSPACE } from "@/types/supabase";
export const useWorkspace = () => {
  const [selectedEmoji, setSelectedEmoji] = useState("🏡");
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
        const payload:WORKSPACE={
            
        }
    }
  );
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
