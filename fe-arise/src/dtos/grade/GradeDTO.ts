import { AuditInfoDTO } from "../base";
import { ClassDTO } from "../classes/ClassDTO";
import { StudentDTO } from "../student";
import { CriteriaDTO } from "./CriteriaDTO";
import { SkillDTO } from "./SkillDTO";
import { TestTypeDTO } from "./TestTypeDTO";

export type GradeDTO = {
  id: number;
  student: StudentDTO;
  classArise: ClassDTO;
  testType: TestTypeDTO;
  comment: string;
  sum: number;
  score: number;
  classification: string;
  skills: SkillDTO[];
  criteria: CriteriaDTO;
} & AuditInfoDTO;