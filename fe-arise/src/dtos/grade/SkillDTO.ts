import { SkillName } from "@/constants/skillName";
import { AuditInfoDTO } from "../base";

export type SkillDTO = {
  id: number;
  name: SkillName;
  score: number;
} & AuditInfoDTO;