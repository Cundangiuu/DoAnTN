import { EditButton } from "@/components/molecules/form";
import { getInvoiceById } from "@/services/InvoiceService";
import { notFound } from "next/navigation";
import InvoiceForm from "../component/InvoiceForm";
import { Button } from "@nextui-org/react";
import { IoMdPrint } from "react-icons/io";
import Link from "next/link";

export default async function InvoiceDetails({
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
        <div className="flex justify-between gap-3">
          <Button
            as={Link}
            href={`/invoice/${id}/print`}
            startContent={<IoMdPrint />}
            color="success"
          >
            Print
          </Button>
          <EditButton href={`/accounting/${id}/pay`} />
        </div>
      </div>
      <InvoiceForm isReadonly isDisabled defaultInvoiceDTO={response.data} />
    </>
  );
}
