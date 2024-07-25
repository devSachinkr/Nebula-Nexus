import React from "react";

type Props = {
  children: React.ReactNode;
  params: any;
};

const layout = ({ children, params }: Props) => {
  return <main className="flex overflow-hidden h-screen">{children}</main>;
};

export default layout;
