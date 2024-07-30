"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface initialValueProps {
  isOpen: boolean;
  setOpen: (modal: React.ReactNode) => void;
  setClose: () => void;
}

const initialValue = {
  isOpen: false,
  setOpen: (modal: React.ReactNode) => {},
  setClose: () => {},
};

const ModalContext = createContext<initialValueProps>(initialValue);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showingModal, setShowingModal] = useState<React.ReactNode>();
  const setClose = () => setIsOpen(false);
  const setOpen = (modal: React.ReactNode) => {
    if (modal) {
      setShowingModal(modal);
      setIsOpen(true);
    }
  };
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return;

  return (
    <ModalContext.Provider value={{ isOpen, setOpen, setClose }}>
      {children}
      {showingModal}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }

  return context;
};
