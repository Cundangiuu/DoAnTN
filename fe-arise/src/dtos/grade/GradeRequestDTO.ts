import { TypeOfTest } from "@/constants/typeOfTest";
import { CriteriaRequestDTO } from "./CriteriaRequestDTO";
import { SkillRequestDTO } from "./SkillRequestDTO";

export type GradeRequestDTO = {
  studentId: number | undefined;
  classId: number;
  typeOfTest: TypeOfTest;
  comment: string;
  score: number;
  sum: number
  classification: string;
  skills: SkillRequestDTO[];
  criteria: CriteriaRequestDTO;
};

export type GradeUpdateRequestDTO = {
  id: number;
  studentId: number;
  classId: number;
  typeOfTest: TypeOfTest;
  comment: string;
  score: number;
  sum: number
  classification: string;
  skills: SkillRequestDTO[];
  criteria: CriteriaRequestDTO;
};
