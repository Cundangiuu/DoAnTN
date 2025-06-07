import { Pageable } from "@/dtos/base";
import { ScheduleDTO } from "@/dtos/schedule/ScheduleDTO";
import { createContext } from "react";

interface ScheduleContextProps {
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    schedules: Pageable<ScheduleDTO> | undefined;
    setSchedules: (students: Pageable<ScheduleDTO> | undefined) => void;
}

const ScheduleContext = createContext<ScheduleContextProps | undefined>(undefined);

export { ScheduleContext };
