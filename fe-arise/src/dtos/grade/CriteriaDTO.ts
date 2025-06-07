import { AuditInfoDTO } from "../base";

export type CriteriaDTO = {
  id: number;
  attitude: string;
  homeworkCompletion: string;
  listening: string;
  reading: string;
  writing: string;
  speaking: string;
  vocabulary: string;
  grammar: string;
  progress: string;
} & AuditInfoDTO;