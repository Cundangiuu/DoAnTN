import { AuditInfoDTO } from "../base";
import { StudentDTO } from "../student/StudentDTO";

export type EnrollmentDTO = {
  id: number;
  student: StudentDTO;
  course: number;
  classCode: string;
  className: string;
  courseCode: string;
  courseName: string;
  enrollmentDate: Date;
} & AuditInfoDTO;
