import { createContext } from "react";

export type NewOrEditContextType = {
  isNew: boolean
  isEdit: boolean
}

export const NewOrEditContext = createContext<NewOrEditContextType | undefined>(undefined);