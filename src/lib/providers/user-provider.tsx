"use client";

import { getUser, getUserSubscription } from "@/actions/user";
import { SUBSCRIPTIONS } from "@/types/supabase";
import { AuthUser } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

interface SupabaseUserContext {
  user: AuthUser | null;
  subscription: SUBSCRIPTIONS | undefined;
}

export const SupabaseUserContext = createContext<SupabaseUserContext>({
  user: null,
  subscription: undefined,
});

export const SupabaseUserProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [subscription, setSubscription] = useState<SUBSCRIPTIONS | undefined>(
    undefined
  );

  const fetchUser = async () => {
    const res = await getUser();
    if (res) {
      setUser(res as AuthUser);
      fetchSubscription(res?.id!);
    } else {
      setUser(null);
    }
  };
  const fetchSubscription = async (userId: string) => {
    const res = await getUserSubscription(userId);
    if (res) {
      setSubscription(res.data);
    } else {
      setSubscription(undefined);
    }
  };
  console.log(user);
  useEffect(() => {
    fetchUser();
  }, []);
  const value = {
    subscription,
    user,
  };
  return (
    <SupabaseUserContext.Provider value={value}>
      {children}
    </SupabaseUserContext.Provider>
  );
};

export const useSupabaseUser = () => {
  const context = useContext(SupabaseUserContext);
  if (!context) {
    throw new Error(
      "useSupabaseUser must be used within a SupabaseUserProvider"
    );
  }
  return context;
};
