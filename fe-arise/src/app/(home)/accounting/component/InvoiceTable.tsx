"use client";

import InvoiceStatus from "@/components/molecules/invoiceStatus";
import TableWrapper from "@/components/molecules/table/TableWrapper";
import { FilterOptionType, Rest } from "@/components/type";
import {
  InvoiceDTO,
  InvoiceStatusConstants,
  PaymentTypeConstants,
} from "@/dtos/invoice/InvoiceDTO";
import { useMeaningfulContext } from "@/hooks";
import { formatToVND } from "@/utils/CurrencyFormat";
import { DateToStringWithoutTime } from "@/utils/DateUtils";
import { updateSearchParams } from "@/utils/UrlUtil";
import { Button, Selection } from "@nextui-org/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useMemo } from "react";
import * as XLSX from "xlsx";
import { InvoiceContext } from "../context/InvoiceContext";
import { getAllInvoiceExport } from "@/services/InvoiceService";
import { DiscountDTO } from "@/dtos";

const InvoiceTable: React.FC = () => {
  const router = useRouter();
  const path = usePathname();
  const params = new URLSearchParams(Array.from(useSearchParams()));
  const searchParams = useSearchParams();
  const searchString = searchParams.get("query") ?? undefined;
  const hasAvatarParam = searchParams.get("moneyType")
    ? String(searchParams.get("moneyType"))
    : "";
  const filterParam = searchParams.get("filter")
    ? String(searchParams.get("filter"))
    : "ALL, NOT_PAID, PARTIALLY_PAID, FULLY_PAID";
  const dateFromStr = searchParams.get("dateFrom");
  const dateToStr = searchParams.get("dateTo");

  const dateFrom = useMemo(
    () => (dateFromStr ? new Date(dateFromStr) : undefined),
    [dateFromStr]
  );
  const dateTo = useMemo(
    () => (dateToStr ? new Date(dateToStr) : undefined),
    [dateToStr]
  );

  const {
    isLoading,
    invoice,
    filterValue,
    setFilterValue,
    hasAvatarValue,
    setHasAvatarValue,
    selection,
    setSelection,
  } = useMeaningfulContext(InvoiceContext);
  const data = invoice;

  const columns = [
    {
      name: "Student Name",
      key: "studentName",
      align: "start",
    },
    {
      name: "Registered Class",
      key: "classCode",
      align: "start",
    },
    { name: "Actual Tuition", key: "tuitionOwed", align: "start" },
    {
      name: "Discount",
      key: "tuitionDiscount",
      align: "start",
    },
    {
      name: "Debt",
      key: "tuitionOwedDiscount",
      align: "start",
    },
    { name: "Actual Collection", key: "amount", align: "start" },
    { name: "Payment Date", key: "date", align: "start" },
    {
      name: "Payment Type",
      key: "paymentType",
      align: "start",
    },
    { name: "Invoice Status", key: "invoiceStatus", align: "center" },
    { name: "Actions", key: "action", align: "center" },
  ];

  const renderCell = (key: string, data: InvoiceDTO) => {
    switch (key) {
      case "studentName":
        return (
          <Link
            href={`/students/${data.studentCode}`}
            className="text-blue-600 underline hover:text-blue-400"
          >
            {data.studentName} ({data.studentNickName})
          </Link>
        );
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
        return <div>{formatToVND(data.tuitionCourseOwed)}</div>;

      case "tuitionDiscount":
        return (
          <div>
            {data.discount
              ? formatToVND(
                  (data.discount.amount * data.tuitionCourseOwed) / 100 +
                    data.invoiceDiscount
                )
              : 0}
          </div>
        );
      case "tuitionOwedDiscount":
        return (
          <div>
            {formatToVND(data.tuitionOwed - data.invoiceDiscount - data.amount)}
          </div>
        );
      case "amount":
        return <div>{formatToVND(data.amount)}</div>;
      case "date":
        return <div>{DateToStringWithoutTime(data.updatedAt)}</div>;
      case "paymentType":
        return <div>{data.paymentType}</div>;
      case "description":
        return <div>{data.description}</div>;
      case "invoiceStatus": {
        return <InvoiceStatus data={data} />;
      }
      case "action":
        return (
          <div className="w-full relative flex justify-center">
            <Button
              as={Link}
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
                : "Invoice"}
            </Button>
          </div>
        );
    }
  };

  const translateInvoiceStatus = (status: string): string => {
    const translations: Record<string, string> = {
      NOT_PAID: "Not Paid",
      PARTIALLY_PAID: "Partially Paid",
      FULLY_PAID: "Fully Paid",
      ALL: "All Statuses",
    };
    return translations[status] || status;
  };

  const allInvoiceStatuses = Object.values(InvoiceStatusConstants);

  const selectOptions: FilterOptionType[0]["options"] = [
    { key: "ALL", label: translateInvoiceStatus("ALL") },
    ...allInvoiceStatuses.map((value) => ({
      key: value,
      label: translateInvoiceStatus(value),
    })),
  ];

  const rest: Rest | undefined = data;

  const filterOptions: FilterOptionType = [
    {
      label: "Invoice Status",
      props: {
        disallowEmptySelection: true,
        selectedKeys: selection,
        selectionMode: "single",
        onSelectionChange: (selection: Selection) => {
          setSelection(selection);
          const selected = Array.from(selection).join(", ");
          const filterValue =
            selected === "ALL"
              ? Object.values(InvoiceStatusConstants).join(", ")
              : selected;
          const updatedParams = updateSearchParams(
            new URLSearchParams(params.toString()),
            {
              filter: filterValue,
            }
          );

          router.push(`${path}/?${updatedParams}`);
        },
      },
      options: selectOptions,
    },
  ];

  const secondFilterOptions: FilterOptionType = [
    {
      label: "Payment Type",
      props: {
        selectedKeys: hasAvatarValue,
        selectionMode: "single",
        onSelectionChange: (selection: Selection) => {
          setHasAvatarValue(selection);
          const selectedKeys = Array.from(selection).join(", ");
          const filterValue =
            selectedKeys === "BOTH" ? "CASH, BANK_TRANSFER" : selectedKeys;
          const updatedParams = updateSearchParams(
            new URLSearchParams(params.toString()),
            {
              moneyType: filterValue,
            }
          );
          router.push(`${path}?${updatedParams}`);
        },
      },
      options: [
        { key: "BOTH", label: "Both" },
        { key: "CASH", label: "Cash" },
        { key: "BANK_TRANSFER", label: "Bank Transfer" },
      ],
    },
  ];

  const exportToExcel = async () => {
    const filter: InvoiceStatusConstants[] = filterParam
      ? filterParam
          .split(",")
          .map((key) => key.trim().toUpperCase() as InvoiceStatusConstants)
          .filter((key) => Object.values(InvoiceStatusConstants).includes(key))
      : [];
  
    const paymentType: PaymentTypeConstants[] = hasAvatarParam
      ? hasAvatarParam
          .split(",")
          .map((key) => key.trim().toUpperCase() as PaymentTypeConstants)
          .filter((key) => Object.values(PaymentTypeConstants).includes(key))
      : [];
  
    const formattedData = await getAllInvoiceExport(
      searchString,
      filter,
      paymentType,
      dateFrom,
      dateTo
    );
  
    if (formattedData.status !== 200 || formattedData.data === undefined) {
      console.log("Failed to fetch data");
      return;
    }
  
    const columnMapping: Record<string, string> = {
      id: "Invoice ID",
      studentNickName: "Student Nickname",
      discount: "Discount Information",
      studentPhoneNumber: "Phone Number",
      invoiceAttempt: "Invoice Attempt",
      staffName: "Staff Name",
      studentName: "Student Name",
      studentCode: "Student Code",
      classCode: "Class Code",
      className: "Class Name",
      tuitionOwed: "Tuition Owed",
      tuitionCourseOwed: "Course Tuition Owed",
      invoiceDiscount: "Invoice Discount",
      amount: "Total Amount",
      paymentType: "Payment Type",
      description: "Description",
      invoiceStatus: "Invoice Status",
      createdBy: "Created By",
      createdAt: "Created At",
      updatedBy: "Last Updated By",
      updatedAt: "Last Updated At",
      tuitionDiscount: "Total Tuition Discount",
      tuitionOwedDiscount: "Debt",
      startDate: "Class Start Date",
    };
  
    const dataWithEnglishHeaders = (formattedData.data as InvoiceDTO[]).map((item) => {
      const newItem: Record<string, string | number> = {};
    
      Object.entries(item).forEach(([key, value]) => {
        if(key === "isDelete"){
          return;
        }
        
        const translatedKey = columnMapping[key] || key;
        
        if (key === "discount") {
          const discount = value as DiscountDTO | null;
          if (discount && discount.description && discount.amount !== null) {
            newItem[translatedKey] = `${discount.description} (${new Intl.NumberFormat("en-US").format(discount.amount)} VND)`;
          } else {
            newItem[translatedKey] = ""; 
          }
        }
        else if (key === "invoiceStatus") {
          newItem[translatedKey] = translateInvoiceStatus(value as string);
        } else if(key === "paymentType") {
          newItem[translatedKey] = value === "CASH" ? "Cash" : "Bank Transfer";
        }
        else if (key === "createdAt" || key === "updatedAt" || key === "startDate") {
          const date = new Date(value as string);
          const enTime = new Date(date.getTime());
          newItem[translatedKey] = enTime.toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
        }
         else if (typeof value === "number" || typeof value === "string") {
          newItem[translatedKey] = value;
        } else if (value) {
          newItem[translatedKey] = JSON.stringify(value);
        } else {
          newItem[translatedKey] = "";
        }
      });
    
      const discount = item.discount as DiscountDTO;
      const tuitionDiscount =
        discount && discount.amount
          ? (discount.amount * item.tuitionCourseOwed) / 100 + item.invoiceDiscount
          : 0;
    
      newItem[columnMapping["tuitionDiscount"]] = tuitionDiscount;
    
      const tuitionOwedDiscount = item.tuitionOwed - item.invoiceDiscount - item.amount;
    
      newItem[columnMapping["tuitionOwedDiscount"]] = tuitionOwedDiscount;
    
      return newItem;
    });
    
  
    const worksheet = XLSX.utils.json_to_sheet(dataWithEnglishHeaders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
  
    XLSX.writeFile(workbook, "Invoices.xlsx");
  };

  return (
    <TableWrapper<InvoiceDTO>
      rest={rest}
      columns={columns}
      renderCell={renderCell}
      data={data?.content ? data.content : []}
      isLoading={isLoading}
      filterValue={filterValue}
      setFilterValue={setFilterValue}
      filterOptions={filterOptions}
      isExport={exportToExcel}
      showDateFilter={true}
      secondaryFilterOption={secondFilterOptions}
    />
  );
};

export default InvoiceTable;