import { AuditInfoDTO } from "../base";
import { DiscountDTO } from "../discount";

export type InvoiceDTO = {
  id: number;
  studentNickName: string;
  discount: DiscountDTO;
  studentPhoneNumber: string;
  invoiceAttempt: number;
  staffName: string;
  studentName: string;
  studentCode: string;
  classCode: string;
  className: string;
  tuitionOwed: number;
  tuitionCourseOwed: number;
  invoiceDiscount: number;
  amount: number;
  paymentType: PaymentTypeConstants;
  description: string;
  invoiceStatus: InvoiceStatusConstants;
  startDate: Date;
} & AuditInfoDTO;

export enum InvoiceStatusConstants {
  NOT_PAID = "NOT_PAID",
  PARTIALLY_PAID = "PARTIALLY_PAID",
  FULLY_PAID = "FULLY_PAID",
}
export function formatInvoiceStatus(status?: InvoiceStatusConstants): string {
  if (!status) return "";

  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export enum PaymentTypeConstants {
  CASH = "CASH",
  BANK_TRANSFER = "BANK_TRANSFER",
}
