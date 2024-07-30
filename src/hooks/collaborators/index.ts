"use client";

import { getUserByEmail } from "@/actions/user";
import { useSupabaseUser } from "@/lib/providers/user-provider";
import { USER } from "@/types/supabase";
import React, { useEffect, useRef, useState } from "react";

export const useCollaborators = ({
  getCollaborators,
}: {
  getCollaborators: (user: USER) => void;
}) => {
  const [searchResult, setSearchResult] = useState<USER[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const { user } = useSupabaseUser();
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (timerRef) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      const { data, error } = await getUserByEmail(e.target.value);
      if (error) {
        return;
      }
      setSearchResult(data!);
    }, 450);
  };
  const addCollaborators = (user: USER) => {
    getCollaborators(user);
  };
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { setSearchResult, searchResult, onChange, user, addCollaborators };
};
