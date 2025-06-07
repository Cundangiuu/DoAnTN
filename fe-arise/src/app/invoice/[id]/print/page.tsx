import React from "react";
import Invoice from "./component/invoice";
import { getInvoiceById } from "@/services/InvoiceService";
import { notFound } from "next/navigation";
import AutoPrint from "./component/AutoPrint";

export default async function Receipt({
  params,
}: Readonly<{ params: Promise<{ id: number }> }>) {
  const { id } = await params;
  const response = await getInvoiceById(id);
  if (!response.data) {
    notFound();
  }
  return (
    <div>
      <AutoPrint />
      <Invoice invoice={response.data} check={true} id={1} />
      <Invoice invoice={response.data} check={false} id={2} />
    </div>
  );
}
