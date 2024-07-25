import { getUser } from "@/actions/user";
import DashboardSetup from "@/components/dashboard/dashboard-setup";
import db from "@/lib/supabase/db";
import { redirect } from "next/navigation";
import React from "react";

const Dashboard = async () => {
  const user = await getUser();
  if (!user) return;
  const workspace = await db.query.workspaces.findFirst({
    where: (w, { eq }) => eq(w.workspaceOwner, user.id),
  });
  if (!workspace) {
    return (
      <div className="bg-background h-screen w-screen flex justify-center items-center">
        <DashboardSetup user={user}></DashboardSetup>
      </div>
    );
  }

  redirect(`/dashboard/${workspace.id}`);
};

export default Dashboard;
