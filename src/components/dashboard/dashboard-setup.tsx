"use client";
import { AuthUser } from "@supabase/supabase-js";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { SUBSCRIPTIONS } from "@/types/supabase";
import Emoji from "../global/emoji-picker";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FieldValues, useForm } from "react-hook-form";
import { useWorkspace } from "@/hooks/workspace";
import { Button } from "../ui/button";
import Loader from "../global/loader";
type Props = {
  user: AuthUser;
  subscription: SUBSCRIPTIONS | null;
};
const DashboardSetup = ({ subscription, user }: Props) => {
  const {
    errors,
    isSubmitting,
    register,
    selectedEmoji,
    setSelectedEmoji,
    onSubmit,
  } = useWorkspace();
  return (
    <Card className="w-[800px] h-screen sm:h-auto">
      <CardHeader>
        <CardTitle>Create A Workspace</CardTitle>
        <CardDescription>
          To begin, {"we'll"} set up a private workspace for you. You can invite
          collaborators later through the workspace settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="text-5xl">
                <Emoji getValue={(emoji) => setSelectedEmoji(emoji)}>
                  {selectedEmoji}
                </Emoji>
              </div>
              <div className="w-full">
                <Label
                  htmlFor="workspaceName"
                  className="text-sm text-muted-foreground"
                >
                  Name
                </Label>
                <Input
                  placeholder="Workspace Name"
                  id="workspaceName"
                  type="text"
                  disabled={isSubmitting}
                  {...register("workspaceName", {
                    required: "Workspace name is required",
                  })}
                />
                <small className="text-red-600">
                  {errors?.workspaceName?.message?.toString()}
                </small>
              </div>
            </div>
            <div className="w-full">
              <Label
                htmlFor="workspaceLogo"
                className="text-sm text-muted-foreground"
              >
                Name
              </Label>
              <Input
                id="workspaceLogo"
                type="file"
                accept="image/*"
                disabled={isSubmitting || subscription?.status !== "active"}
                {...register("workspaceLogo", {})}
              />
              <small className="text-red-600">
                {errors?.workspaceLogo?.message?.toString()}
              </small>
            </div>
          </div>
          <div className="flex items-center justify-end mt-3">
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? <Loader /> : "Create Workspace"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DashboardSetup;
