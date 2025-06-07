import { Pageable } from "@/dtos/base";
import { InvoiceDTO } from "@/dtos/invoice/InvoiceDTO";
import { Selection } from "@nextui-org/react";
import { createContext, Dispatch, SetStateAction } from "react";

interface InvoiceContextProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  invoice: Pageable<InvoiceDTO> | undefined;
  setInvoice: (courses: Pageable<InvoiceDTO> | undefined) => void;
  filterValue: string | null;
  setFilterValue: (filterValue: string | null) => void;
  hasAvatarValue: Selection;
  setHasAvatarValue: Dispatch<SetStateAction<Selection>>;
  selection: Selection;
  setSelection: React.Dispatch<React.SetStateAction<Selection>>;
}

const InvoiceContext = createContext<InvoiceContextProps | undefined>(
  undefined
);

export { InvoiceContext };
