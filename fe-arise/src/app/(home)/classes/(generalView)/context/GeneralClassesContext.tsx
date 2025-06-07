import { Pageable } from "@/dtos/base";
import { ClassDTO } from "@/dtos/classes/ClassDTO";
import { Selection } from "@nextui-org/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams } from "next/navigation";
import { createContext } from "react";

export interface GeneralClassesContextProps {
  classes: Pageable<ClassDTO>;
  filterValue: string | undefined;
  selection: Selection;
  currentView?: string;
  searchParams: ReadonlyURLSearchParams;
  path: string;
  router: AppRouterInstance;
  exportToExcel: () => Promise<void>;
}

const GeneralClassContext = createContext<
  GeneralClassesContextProps | undefined
>(undefined);

export { GeneralClassContext };

