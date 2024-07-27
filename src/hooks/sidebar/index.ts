"use client";
import { getFolders } from "@/actions/folder";
import { getUser, getUserSubscription } from "@/actions/user";
import {
  getCollaboratingWorkspaces,
  getPrivateWorkspaces,
  getSharedWorkspaces,
} from "@/actions/workspace";
import { useAppState } from "@/lib/providers/state-provider";
import { FOLDER, WORKSPACE } from "@/types/supabase";
import { AuthUser } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/supabase-client";
import Nebula from "../../../public/nebula.png";

export const useSidebar = ({ workspaceId,user }: { workspaceId: string,user:AuthUser }) => {
  
  const router = useRouter();
  
  const [userSubscriptionData, setUserSubscriptionData] = useState<any>(null);
  const [foldersData, setFoldersData] = useState<FOLDER[]>([]);
  const [privateWorkSpacesData, setPrivateWorkSpacesData] = useState<
    WORKSPACE[]
  >([]);
  const [collaboratorsWorkspacesData, setCollaboratorsWorkspacesData] =
  useState<WORKSPACE[]>([]);
  
  const [sharedWorkplacesData, setSharedWorkplacesData] = useState<WORKSPACE[]>(
    []
  );
  console.log("user",user, "subs :" ,userSubscriptionData,"private",privateWorkSpacesData,"collab",collaboratorsWorkspacesData,"shared",sharedWorkplacesData)
  const fetchUser = async () => {

    const { data, error } = await getUserSubscription(user?.id!);
    if (error) {
      router.push("/dashboard");
    }
    setUserSubscriptionData(data);
  };

  const fetchFolders = async () => {
    const { data, error } = await getFolders(workspaceId);
    if (error) {
      router.push("/dashboard");
    }
    setFoldersData(data!);
  };

  const fetchWorkspacesData = async () => {
    console.log(user)
    if (!user) return;

    const [privateWorkSpaces, collaboratorsWorkspaces, sharedWorkplaces] =
      await Promise.all([
        getPrivateWorkspaces(user.id),
        getCollaboratingWorkspaces(user.id),
        getSharedWorkspaces(user.id),
      ]);

    if (privateWorkSpaces.length) setPrivateWorkSpacesData(privateWorkSpaces);
    if (collaboratorsWorkspaces.length)
      setCollaboratorsWorkspacesData(collaboratorsWorkspaces);
    if (sharedWorkplaces.length) setSharedWorkplacesData(sharedWorkplaces);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchFolders();
  }, []);
  useEffect(() => {
   fetchWorkspacesData();
  }, []);

  return {
    user,
    foldersData,
    privateWorkSpacesData,
    collaboratorsWorkspacesData,
    sharedWorkplacesData,
    userSubscriptionData,
  };
};

export const useSidebarDropdown = ({
  privateWorkspaces,
  sharedWorkspaces,
  defaultValues,
  collaboratingWorkspaces,
}: {
  privateWorkspaces: WORKSPACE[] | [];
  sharedWorkspaces: WORKSPACE[] | [];
  defaultValues: WORKSPACE | undefined;
  collaboratingWorkspaces: WORKSPACE[] | [];
}) => {
  const { dispatch, state } = useAppState();
  const [selectedOption, setSelectedOption] = useState<WORKSPACE>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!state.workspaces.length) {
      dispatch({
        type: "SET_WORKSPACES",
        payload: {
          workspaces: [
            ...privateWorkspaces,
            ...collaboratingWorkspaces,
            ...sharedWorkspaces,
          ].map((w) => {
            return {
              ...w,
              folders: [],
            };
          }),
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collaboratingWorkspaces, privateWorkspaces, sharedWorkspaces]);

  const handleSelect = (opt: WORKSPACE) => {
    setSelectedOption(opt);
    setIsOpen(false);
  };
  return { isOpen, selectedOption, setSelectedOption, handleSelect };
};

export const useCurrentWorkspace = ({
  workspace,
}: {
  workspace: WORKSPACE;
}) => {
  const supabase = createClient();

  const [workspaceLogo, setWorkspaceLogo] = useState<string>(Nebula.src);
  useEffect(() => {
    if (workspace.logo) {
      const path = supabase.storage
        .from("nebula-workspace")
        .getPublicUrl(workspace.logo)?.data?.publicUrl;

      setWorkspaceLogo(path);
    }
  }, [workspace]);
  return { workspaceLogo };
};
