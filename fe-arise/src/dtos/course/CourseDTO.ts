import { CourseLevelConstants } from "@/constants/course";
import { AuditInfoDTO } from "../base";
import { FormulaDTO } from "../formula/FormulaDTO";
import { LessonDTO } from "../lesson/LessonDTO";
import { EnrollmentDTO } from "../enrollment/EnrollmentDTO";

export type CourseDTO = {
  id: number;
  code: string;
  name: string;
  tuitionRate: number;
  numberHour: number;
  courseLevel: CourseLevelConstants;
  description: string;
  lessons: LessonDTO[];
  enrollments: EnrollmentDTO[];
  formula: FormulaDTO;
} & AuditInfoDTO;

export type CourseExportDTO = {
  code: string;
  name: string;
  tuitionRate: number;
  numberHour: number;
  courseLevel: CourseLevelConstants;
  description: string;
};
