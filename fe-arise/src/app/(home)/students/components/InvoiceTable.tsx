"use client";

import TableWrapper from "@/components/molecules/table/TableWrapper";
import { Rest } from "@/components/type";
import { SessionContext } from "@/contexts";
import { InvoiceDTO, InvoiceStatusConstants } from "@/dtos/invoice/InvoiceDTO";
import { useMeaningfulContext } from "@/hooks";
import { getAllInvoiceByStudent } from "@/services/InvoiceService";
import { formatToVND } from "@/utils/CurrencyFormat";
import { Button, Link } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  studentCode: string;
  isReadonly?: boolean;
};

const InvoiceTable = ({ studentCode }: Props) => {
  const [data, setData] = useState<InvoiceDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin, isAccountant } = useMeaningfulContext(SessionContext);

  const columns = [
    { name: "Enrolled Class", key: "classCode" },
    { name: "Tuition Owed", key: "tuitionOwed" },
    { name: "Amount Paid", key: "amount" },
    { name: "Payment Type", key: "paymentType" },
    { name: "Description", key: "description" },
    { name: "Invoice Status", key: "invoiceStatus" },
    ...(isAdmin || isAccountant ? [{ name: "Action", key: "action" }] : []),
  ];

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await getAllInvoiceByStudent(studentCode);
        if (!response.data) {
          return;
        }
        setData(response.data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch invoice");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [studentCode]);

  const renderCell = (key: string, data: InvoiceDTO) => {
    switch (key) {
      case "classCode":
        return (
          <Link
            href={`/classes/${data.classCode}`}
            className="text-blue-600 underline hover:text-blue-400"
          >
            {data.className}
          </Link>
        );
      case "tuitionOwed":
        return <div>{formatToVND(data.tuitionOwed)}</div>;
      case "amount":
        return <div>{formatToVND(data.amount)}</div>;
      case "paymentType":
        return <div>{data.paymentType}</div>;
      case "description":
        return <div>{data.description}</div>;
      case "invoiceStatus": {
        let statusClass = "";
        let statusLabel = "";

        if (data.invoiceStatus === InvoiceStatusConstants.FULLY_PAID) {
          statusClass = "bg-green-100 text-green-800";
          statusLabel = "Fully Paid";
        } else if (
          data.invoiceStatus === InvoiceStatusConstants.PARTIALLY_PAID
        ) {
          statusClass = "bg-yellow-100 text-yellow-800";
          statusLabel = "Partially Paid";
        } else if (data.invoiceStatus === InvoiceStatusConstants.NOT_PAID) {
          statusClass = "bg-red-100 text-red-800";
          statusLabel = "Not Paid";
        }

        return (
          <span className={`status-badge px-2 py-1 rounded ${statusClass}`}>
            {statusLabel}
          </span>
        );
      }
      case "action":
        return (
          <div className="w-full relative flex justify-center">
            <Button
              as={Link}
              isIconOnly={
                data.invoiceStatus === InvoiceStatusConstants.NOT_PAID
              }
              href={
                data.invoiceStatus === InvoiceStatusConstants.NOT_PAID
                  ? `/accounting/${data.id}/pay`
                  : `/accounting/${data.id}`
              }
              color={
                data.invoiceStatus === InvoiceStatusConstants.NOT_PAID
                  ? "danger"
                  : "primary"
              }
            >
              {data.invoiceStatus === InvoiceStatusConstants.NOT_PAID
                ? "Pay"
                : "View Invoice"}
            </Button>
          </div>
        );
    }
  };

  const rest: Rest | undefined = {
    totalElements: data.length,
    totalPages: 0,
    size: data.length,
    number: data.length,
    pageable: {
      pageNumber: 0,
      pageSize: data.length,
      offset: 0,
      sort: [],
      paged: true,
      unpaged: false,
    },
    sort: [],
    first: true,
    last: true,
    empty: false,
    numberOfElements: data.length,
  };

  return (
    <TableWrapper<InvoiceDTO>
      rest={rest}
      columns={columns}
      renderCell={renderCell}
      data={data}
      isLoading={loading}
    />
  );
};

export default InvoiceTable;
