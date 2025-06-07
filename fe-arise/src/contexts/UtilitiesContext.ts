import { createContext } from "react";

export type UtilitiesContextType = {
  bodyScrollLock: {
    lock: () => void;
    unlock: () => void;
    isLocked: boolean;
  };
};

export const UtilitiesContext = createContext<UtilitiesContextType | undefined>(
  undefined
);
