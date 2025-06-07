import { Pageable } from "@/dtos/base";
import { DiscountDTO } from "@/dtos/discount/DiscountDTO";
import { createContext } from "react";

interface DiscountContextProps {
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    discounts: Pageable<DiscountDTO> | undefined;
    setDiscounts: (students: Pageable<DiscountDTO> | undefined) => void;
}

const DiscountContext = createContext<DiscountContextProps | undefined>(undefined);

export { DiscountContext };
