import { TypeOfTest } from "@/constants/typeOfTest";
import { AuditInfoDTO } from "../base";

export type TestTypeDTO = {
  id: number;
  type: TypeOfTest;
  description: string;
} & AuditInfoDTO