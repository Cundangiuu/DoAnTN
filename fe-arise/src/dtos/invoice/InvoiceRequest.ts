import { PaymentTypeConstants } from "./InvoiceDTO";

export type InvoiceRequest = {
  invoiceId: number;
  amount: number;
  invoiceDiscount: number;
  paymentType: PaymentTypeConstants | null | string;
  description: string;
};
