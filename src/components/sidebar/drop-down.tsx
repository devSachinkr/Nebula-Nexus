import React from "react";

type Props = {
  title: string;
  listType: "folder" | "files";
  id: string;
  iconId: string;
};

const DropDown = ({ iconId, id, listType, title }: Props) => {
  return <div >{title}</div>;
};

export default DropDown;
