import React from "react";
import { SupabaseUserProvider } from "./user-provider";
import AppStateProvider from "./state-provider";
import { DropDownProvider } from "./drop-down-provide";
import { ModalProvider } from "./modal-provider";

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SupabaseUserProvider>
      <ModalProvider>
        <AppStateProvider>
         {children}
        </AppStateProvider>
      </ModalProvider>
    </SupabaseUserProvider>
  );
};

export default RootProvider;
