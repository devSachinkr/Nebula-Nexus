import { getUser, getUserSubscription } from "@/actions/user";
import DashboardSetup from "@/components/dashboard/dashboard-setup";
import db from "@/lib/supabase/db";
import { SUBSCRIPTIONS } from "@/types/supabase";
import { redirect } from "next/navigation";
import React from "react";

const Dashboard = async () => {
  const user = await getUser();
  if (!user) return;
  const workspace = await db.query.workspaces.findFirst({
    where: (w, { eq }) => eq(w.workspaceOwner, user.id),
  });
  const { data: subscription, error: subscriptionError } =
    await getUserSubscription(user.id);
  if (subscriptionError) return;
  if (!workspace) {
    return (
      <div className="bg-background h-screen w-screen flex justify-center items-center">
        <DashboardSetup
          user={user}
          subscription={subscription?.[0] as SUBSCRIPTIONS | null}
        ></DashboardSetup>
      </div>
    );
  }

  redirect(`/dashboard/${workspace.id}`);
};

export default Dashboard;
