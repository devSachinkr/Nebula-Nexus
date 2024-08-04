import React from "react";
import { SupabaseUserProvider } from "./user-provider";
import AppStateProvider from "./state-provider";
import { DropDownProvider } from "./drop-down-provide";
import { ModalProvider } from "./modal-provider";
import { QuillProvider } from "./quill-editor-provider";

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SupabaseUserProvider>
      <AppStateProvider>
          <ModalProvider>{children}</ModalProvider>
      </AppStateProvider>
    </SupabaseUserProvider>
  );
};

export default RootProvider;
