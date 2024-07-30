"use client";
import { useCollaborators } from "@/hooks/collaborators";
import { USER } from "@/types/supabase";
import React, { ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Typography from "../global/typography";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Nebula from "../../../public/nebula.png";
import { Button } from "../ui/button";
type Props = {
  existingCollab: USER[] | [];
  getCollaborators: (c: USER) => void;
  children: ReactNode;
};

const CollaboratorsDetails = ({
  children,
  existingCollab,
  getCollaborators,
}: Props) => {
  const { onChange, searchResult, user, addCollaborators } = useCollaborators({getCollaborators});
  return (
    <Sheet>
      <SheetTrigger className="w-4">{children}</SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Search Collaborators</SheetTitle>
          <SheetDescription>
            <Typography
              variant="p"
              text="All of your collaborators are there. You can remove any of them from your settings."
            />
          </SheetDescription>
        </SheetHeader>
        <div className="flex items-center justify-center  gap-2  mt-2 ">
          <Search />
          <Input name="name" placeholder="Email" onChange={onChange} />
        </div>
        <ScrollArea className={"mt-6 overflow-y-auto w-full  rounded-md"}>
       
          {searchResult
            .filter((r) => !existingCollab.some((e) => e.id === r.id))
            .filter((re) => re.id !== user?.id)
            .map((u) => (
              <div className="p-4 flex justify-between items-center" key={u.id}>
                <div className="flex gap-4 items-center">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={u.avatarUrl ?? Nebula.src ?? ""} />
                    <AvatarFallback>NN</AvatarFallback>
                  </Avatar>
                  <div className="text-sm gap-2 overflow-hidden overflow-ellipsis w-[180px] text-muted-foreground">
                    {u?.email}
                  </div>
                </div>
                <Button
                  variant={"secondary"}
                  onClick={()=>addCollaborators(u)}
                >Add</Button>
              </div>
            ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default CollaboratorsDetails;
