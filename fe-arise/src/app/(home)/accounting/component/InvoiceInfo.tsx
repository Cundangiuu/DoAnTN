"use client";

import { getInvoiceReport } from "@/services/InvoiceService";
import InvoiceCard from "./InvoiceCard";
import { formatToVND } from "@/utils/CurrencyFormat";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { InvoiceReportDTO } from "@/dtos/invoice/InvoiceReportDTO";
import { toast } from "sonner";
import { Spinner } from "@nextui-org/react";

export default function InvoiceInfo() {
  const searchParams = useSearchParams();
  const dateFromStr = searchParams.get("dateFrom");
  const dateToStr = searchParams.get("dateTo");
  const dateFrom = dateFromStr ? new Date(dateFromStr) : undefined;
  const dateTo = dateToStr ? new Date(dateToStr) : undefined;
  const [invoiceData, setInvoiceData] = useState<InvoiceReportDTO>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const response = await getInvoiceReport(dateFrom, dateTo);
      if (!response.data) {
        toast.error("Failed to fetch invoice");
        return;
      }
      setInvoiceData(response.data);
      setLoading(false);
    }

    fetchData();
  }, [dateFromStr, dateToStr]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner className="animate-spin text-green-500 text-4xl" />
      </div>
    );
  }

  if (!invoiceData) {
    return <p>No invoice data available.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <InvoiceCard
        title={"Student who owed Tuition"}
        translate={"Sinh viên nợ học phí"}
        description={(invoiceData.studentOwed ?? 0).toString()}
      />
      <InvoiceCard
        title={"Outstanding Debt"}
        translate="Nợ tồn đọng"
        description={formatToVND(invoiceData.totalDebt ?? 0)}
      />
      <InvoiceCard
        title={"Revenue"}
        translate="Doanh thu"
        description={formatToVND(invoiceData.weeklyRevenue ?? 0)}
      />
    </div>
  );
}
