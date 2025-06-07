import { User } from "next-auth";
import { createContext } from "react";

export type SessionContextType = {
  isTeacher: boolean;
  isAdmin: boolean;
  isAccountant: boolean;
  user: User | null | undefined;
  roles: string[] | undefined
}

export const SessionContext = createContext<SessionContextType | undefined>(undefined);