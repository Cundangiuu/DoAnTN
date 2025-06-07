import { createContext } from "react";

export type SideBarContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  nonInstructive: boolean;
  setNonInstructive: (nonInstructive: boolean) => void;
};

export const SideBarContext = createContext<SideBarContextType | undefined>(
  undefined
);
