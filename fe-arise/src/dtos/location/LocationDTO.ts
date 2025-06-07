import { AuditInfoDTO } from "../base";

export type LocationDTO = {
    id: number;
    branch: string;
    room: string;
    code: string;
    scheduleIds: number[]
} & AuditInfoDTO;