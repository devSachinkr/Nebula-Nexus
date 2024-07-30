import { useWorkspaceForm } from "@/hooks/workspace";
import { WORKSPACE } from "@/types/supabase";
import { Lock, PlusCircle, Share } from "lucide-react";
import React from "react";
import CollaboratorsDetails from "../collaborators/collabrators-details";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Nebula from "../../../public/nebula.png";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Loader from "../global/loader";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type Props = {
  defaultValue?: WORKSPACE;
};

const WorkspaceForm = ({ defaultValue }: Props) => {
  const {
    title,
    setPermission,
    permission,
    setTitle,
    collaborators,
    handleSubmit,
    loading,
    addCollaborator,
    removeCollaborator,
  } = useWorkspaceForm({
    defaultValue,
  });
  return (
    <div className="flex gap-4 flex-col">
      <div>
        <Label htmlFor="name" className="text-sm text-muted-foreground">
          Name
        </Label>
        <div className="flex justify-center items-center gap-2">
          <Input
            id="name"
            className="w-full"
            value={title}
            placeholder="Workspace Name"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
          />
        </div>
      </div>
      <>
        <Label htmlFor="permissions" className="text-sm text-muted-foreground">
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
                    <p>Your workspace is private and only accessible by you.</p>
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
      <Button
        type="button"
        disabled={
          !title || (permission === "shared" && collaborators.length === 0)
        }
        variant={"secondary"}
        onClick={handleSubmit}
      >
        {!loading ? "Create" : <Loader />}
      </Button>
    </div>
  );
};

export default WorkspaceForm;
