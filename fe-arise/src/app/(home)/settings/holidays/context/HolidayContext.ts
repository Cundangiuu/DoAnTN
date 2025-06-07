import { Pageable } from "@/dtos/base";
import { HolidayDTO } from "@/dtos/holiday/HolidayDTO";
import { createContext } from "react";

interface HolidayContextProps {
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    holidays: Pageable<HolidayDTO> | undefined;
    setHolidays: (students: Pageable<HolidayDTO> | undefined) => void;
}

const HolidayContext = createContext<HolidayContextProps | undefined>(undefined);

export { HolidayContext };
