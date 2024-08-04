"use client";
import { useSettings } from "@/hooks/settings";
import { Briefcase, Lock, PlusCircle, Share } from "lucide-react";
import Nebula from "../../../public/nebula.png";
import React from "react";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import CollaboratorsDetails from "../collaborators/collabrators-details";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import Loader from "../global/loader";
import { Alert, AlertDescription } from "../ui/alert";
import Image from "next/image";

type Props = {};

const SettingsForm = (props: Props) => {
  const {
    permission,
    setPermission,
    collaborators,
    alert,
    workspaceData,
    changeWorkspaceName,
    loading,
    changeWorkspaceLogo,
    addCollaborator,
    removeCollaborator,
    handleSubmit,
    workspaceLogo,
  } = useSettings();
  return (
    <div className="flex gap-4 flex-col">
      <p className="flex items-center gap-2 mt-6">
        <Briefcase size={20} />
        Workspace
      </p>
      <Separator />
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="workspaceName"
          className="text-sm text-muted-foreground"
        >
          Name
        </Label>
        <Input
          name="workspaceName"
          value={workspaceData ? workspaceData.title : ""}
          placeholder="Workspace Name"
          onChange={changeWorkspaceName}
        />
        <Label
          htmlFor="workspaceLogo"
          className="text-sm text-muted-foreground"
        >
          Workspace Logo
        </Label>
        <Input
          name="workspaceLogo"
          type="file"
          accept="image/*"
          placeholder="Workspace Logo"
          onChange={changeWorkspaceLogo}
          disabled={loading}
        />
        {workspaceLogo &&
          workspaceData &&
          (loading ? (
            <Loader />
          ) : (
            <div className="flex w-full justify-center items-center">
              <Image
                src={workspaceLogo}
                className="object-cover rounded-md"
                width={200}
                height={200}
                alt={workspaceData.title}
              />
            </div>
          ))}
        {/* {subscription?.status !== 'active' && (
          <small className="text-muted-foreground">
            To customize your workspace, you need to be on a Pro Plan
          </small>
        )} */}
        <>
          <Label
            htmlFor="permissions"
            className="text-sm text-muted-foreground"
          >
            Permissions{" "}
          </Label>
          <Select
            onValueChange={(val: "private" | "shared") => {
              setPermission(val);
            }}
            defaultValue={permission}
          >
            <SelectTrigger className="w-full h-26 -mt-3">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="private">
                  <div
                    className="flex p-2 
               g-4 justify-center items-center"
                  >
                    <Lock className="pr-2" size={25} />
                    <article className="text-left flex flex-col">
                      <span>Private</span>
                      <p>
                        Your workspace is private and only accessible by you.
                      </p>
                    </article>
                  </div>
                </SelectItem>
                <SelectItem value="shared">
                  <div
                    className="flex p-2 
               g-4 justify-center items-center"
                  >
                    <Share className="pr-2" />
                    <article className="text-left flex flex-col">
                      <span>Shared</span>
                      <p>Your workspace is shared with other users.</p>
                    </article>
                  </div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </>
        {permission === "shared" && (
          <>
            <CollaboratorsDetails
              existingCollab={collaborators}
              getCollaborators={(u) => addCollaborator(u)}
            >
              <Button
                type="button"
                className=" flex items-center text-sm mt-4 gap-x-2"
              >
                <PlusCircle />
                Add Collaborator
              </Button>
            </CollaboratorsDetails>
            <div className="mt-4">
              <span className="text-sm text-muted-foreground">
                Collaborators {collaborators.length || ""}
              </span>
              <ScrollArea className="h-[120px] overflow-y-auto w-full rounded-md border border-muted-foreground">
                {collaborators.length ? (
                  collaborators.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 flex justify-between items-center"
                    >
                      <div className="flex gap-4 items-center ">
                        <Avatar>
                          <AvatarImage src={c.avatarUrl ?? Nebula.src ?? ""} />
                          <AvatarFallback>NN</AvatarFallback>
                        </Avatar>
                        <div className="text-sm gap-2 text-muted-foreground overflow-hidden overflow-ellipsis sm:w-[300px] w-[140px]">
                          {c.email}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant={"secondary"}
                        onClick={() => removeCollaborator(c)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="absolute right-0 left-0 top-0 bottom-0 flex justify-center items-center">
                    <div className="text-muted-foreground text-sm">
                      You have no any collaborators!
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>
          </>
        )}

        <Alert variant={"destructive"}>
          <AlertDescription>Sb delete ho jayga </AlertDescription>

          <Button
            type="submit"
            size={"sm"}
            className="mt-4 bg-destructive/40 border-2 border-destructive"
            variant={"destructive"}
            onClick={handleSubmit}
          >
            Delete
          </Button>
        </Alert>
      </div>
    </div>
  );
};

export default SettingsForm;
