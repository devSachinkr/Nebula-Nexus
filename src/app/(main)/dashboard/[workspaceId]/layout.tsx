import { getUser } from "@/actions/user";
import Sidebar from "@/components/sidebar";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: {
    workspaceId: string;
  };
};

const layout = async ({ children, params: { workspaceId } }: Props) => {
  const user = await getUser();
  if (!user) redirect("/dashboard");
  return (
    <main
      className="flex overflow-hidden
  h-screen
  w-screen
"
    >
      <Sidebar workspaceId={workspaceId} user={user} />
      {/*<MobileSidebar>
    <Sidebar
      params={params}
      className="w-screen inline-block sm:hidden"
    />
  </MobileSidebar> */}
      <div
        className="dark:border-Neutrals-12/70
    border-l-[1px]
    w-full
    relative
    overflow-y-scroll
    overflow-x-hidden
  "
      >
        {children}
      </div>
    </main>
  );
};

export default layout;
