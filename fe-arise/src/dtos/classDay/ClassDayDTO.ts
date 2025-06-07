import { AbsenceDTO } from "../absence/AbsenceDTO";
import { AuditInfoDTO } from "../base";
import { LessonDTO } from "../lesson/LessonDTO";
import { LocationDTO } from "../location";
import { ScheduleDTO } from "../schedule";
import { StaffDTO } from "../staff";

export type ClassDayDTO = {
  id: number;
  classTvms: string;
  className: string;
  classDate?: Date;
  schedule?: ScheduleDTO;
  isFinal: boolean;
  isMidterm: boolean;
  comment: string;
  homeWork: string;
  rating: number;
  lesson: LessonDTO;
  location?: LocationDTO;
  teacher?: StaffDTO;
  absence?: AbsenceDTO[];
} & AuditInfoDTO;
