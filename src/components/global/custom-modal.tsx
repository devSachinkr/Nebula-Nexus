import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useModal } from "@/lib/providers/modal-provider";

interface Props {
  title: string;
  desc?: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
}
const CustomModal = ({ desc, title, children, defaultOpen }: Props) => {
  const { isOpen, setClose } = useModal();
  return (
    <Dialog open={isOpen || defaultOpen} onOpenChange={setClose}>
      <DialogContent className="overflow-auto md:max-h-[700px] md:h-fit h-screen bg-card">
        <DialogHeader className="pt-8 text-left">
          {title && (
            <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          )}
          {desc && <DialogDescription>{desc}</DialogDescription>}
          {children && children}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
