import { DayOfWeek } from "@/constants/dayOfWeek";
import { AuditInfoDTO } from "@/dtos/base";

export type ScheduleDTO = {
    id: number;
    code: string;
    description: string;
    startTime: string;
    endTime: string;
    dayOfWeek: DayOfWeek;
} & AuditInfoDTO;