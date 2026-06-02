"use client";

import type { JSX, ReactNode } from "react";
import { Dialog } from "@/components/ui/dialog";

interface ModalFormProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function ModalForm({ open, onClose, title, children }: ModalFormProps): JSX.Element | null {
  return (
    <Dialog open={open} onClose={onClose} title={title}>
      {children}
    </Dialog>
  );
}
