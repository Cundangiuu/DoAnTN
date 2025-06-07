import { AuditInfoDTO } from "../base";
import { ClassDayDTO } from "../classDay/ClassDayDTO";
import { CourseDTO } from "../course";
import { ScheduleDTO } from "../schedule/ScheduleDTO";
import { StaffDTO } from "../staff";
import { StudentDTO } from "../student/StudentDTO";

export type ClassDTO = {
  id: number;
  code: string;
  name: string;
  startDate: string | null;
  course: CourseDTO;
  staff: StaffDTO;
  schedules: ScheduleDTO[];
  students: StudentDTO[];
  classDays: ClassDayDTO[];
} & AuditInfoDTO;
