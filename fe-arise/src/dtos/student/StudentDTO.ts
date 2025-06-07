import { AuditInfoDTO } from "../base";
import { DiscountDTO } from "../discount/DiscountDTO";

export type StudentDTO = {
  id: number;
  code: string;
  name: string;
  emailAddress: string;
  nickname: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  note: string;
  avatarUrl: string;
  discount: DiscountDTO;
} & AuditInfoDTO;
