import { AuditInfoDTO } from "../base";

export type InvoiceReportDTO = {
  studentOwed: number;
  totalDebt: number;
  weeklyRevenue: number;
} & AuditInfoDTO;
