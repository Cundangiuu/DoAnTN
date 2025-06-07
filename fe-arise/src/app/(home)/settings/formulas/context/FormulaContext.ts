import { Pageable } from "@/dtos/base";
import { FormulaDTO } from "@/dtos/formula/FormulaDTO";
import { createContext } from "react";

interface FormulaContextProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  formulas: Pageable<FormulaDTO> | undefined;
  setFormulas: (formulas: Pageable<FormulaDTO> | undefined) => void;
}

const FormulaContext = createContext<FormulaContextProps | undefined>(undefined);

export { FormulaContext };
