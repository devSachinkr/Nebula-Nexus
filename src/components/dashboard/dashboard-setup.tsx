import { AuthUser } from "@supabase/supabase-js";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
type Props = {
  user: AuthUser;
  subscription: {} | null;
};
const DashboardSetup = ({ subscription, user }: Props) => {
  return (
    <Card className="w-[800px] h-screen sm:h-auto">
      <CardHeader>
        <CardTitle>Create A Workspace</CardTitle>
        <CardDescription>
        To begin, {"we'll"} set up a private workspace for you. You can invite collaborators later through the workspace settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
          <form onSubmit={()=>{}}>
            <div className="flex flex-col gap-4 "></div>
          </form>
      </CardContent>
    </Card>
  );
};

export default DashboardSetup;
