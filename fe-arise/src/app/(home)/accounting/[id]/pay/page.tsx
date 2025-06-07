import { notFound } from "next/navigation";
import { getInvoiceById } from "@/services/InvoiceService";
import InvoiceForm from "../../component/InvoiceForm";

export default async function ClassEdit({
  params,
}: Readonly<{ params: Promise<{ id: number }> }>) {
  const { id } = await params;
  const response = await getInvoiceById(id);
  if (!response.data) {
    notFound();
  }

  return (
    <>
      <div className="w-full mt-8 flex gap-3 justify-between">
        <h1 className="font-bold uppercase">
          {response.data.className} - {response.data.studentName}
        </h1>
      </div>
      <InvoiceForm defaultInvoiceDTO={response.data} />
    </>
  );
}
