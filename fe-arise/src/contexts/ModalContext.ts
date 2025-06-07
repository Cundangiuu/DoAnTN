import { createContext } from "react";

export type ModalContextType = {
  modalContent: React.ReactNode;
  showModal: (content: NonNullable<React.ReactNode>) => void;
  hideModal: () => void;
};

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);
