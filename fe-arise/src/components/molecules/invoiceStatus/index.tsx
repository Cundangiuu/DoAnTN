import { InvoiceDTO, InvoiceStatusConstants } from "@/dtos/invoice/InvoiceDTO";
import Link from "next/link";

export default function InvoiceStatus({
  data,
  href,
}: Readonly<{ data: InvoiceDTO; href?: string }>) {
  let statusClass = "";
  let statusLabel = "";

  if (data.invoiceStatus === InvoiceStatusConstants.FULLY_PAID) {
    statusClass = "bg-green-100 text-green-800";
    statusLabel = "Đã Thanh Toán Đầy Đủ";
  } else if (data.invoiceStatus === InvoiceStatusConstants.PARTIALLY_PAID) {
    statusClass = "bg-yellow-100 text-yellow-800";
    statusLabel = "Thanh Toán Một Phần";
  } else if (data.invoiceStatus === InvoiceStatusConstants.NOT_PAID) {
    statusClass = "bg-red-100 text-red-800";
    statusLabel = "Chưa Thanh Toán";
  }

  return href ? (
    <Link
      href={href}
      className={`status-badge px-2 py-1 rounded hover:opacity-70 ${statusClass}`}
    >
      {statusLabel}
    </Link>
  ) : (
    <span className={`status-badge px-2 py-1 rounded ${statusClass}`}>
      {statusLabel}
    </span>
  );
}
