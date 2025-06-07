import { AuditInfoDTO } from "../base";

export type HolidayDTO = {
    id: number;
    holidayType: string;
    description: string;
    startDate: string;
    endDate: string;
} & AuditInfoDTO;
