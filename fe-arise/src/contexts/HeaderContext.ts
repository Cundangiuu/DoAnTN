import React, { createContext } from "react";

export type HeaderContextType = {
  contentHeader: React.ReactNode;
  setContentHeader: (contentHeader: React.ReactNode) => void;
  showContent: boolean;
  setShowContent: (showContent: boolean) => void;
};

export const HeaderContext = createContext<HeaderContextType | undefined>(
  undefined
);
