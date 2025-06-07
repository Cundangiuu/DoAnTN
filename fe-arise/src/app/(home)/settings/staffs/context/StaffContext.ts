import { Pageable } from "@/dtos/base";
import { StaffDTO } from "@/dtos/staff/StaffDTO";
import { createContext } from "react";

interface StaffContextProps {
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    staffs: Pageable<StaffDTO> | undefined;
    setStaffs: (staffs: Pageable<StaffDTO> | undefined) => void;
}

const StaffContext = createContext<StaffContextProps | undefined>(undefined);

export { StaffContext };
