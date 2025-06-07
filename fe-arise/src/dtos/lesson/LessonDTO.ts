import { TypeOfTest } from "@/constants/typeOfTest";
import { AuditInfoDTO } from "@/dtos/base";

export type LessonDTO = {
  id: number;
  description: string;
  courseCode: string;
  lessonType: TypeOfTest;
} & AuditInfoDTO;