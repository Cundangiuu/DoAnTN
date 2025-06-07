"use client";

import { Pageable } from "@/dtos/base";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  InvoiceDTO,
  InvoiceStatusConstants,
  PaymentTypeConstants,
} from "@/dtos/invoice/InvoiceDTO";
import { getAllInvoice } from "@/services/InvoiceService";
import { InvoiceContext } from "./InvoiceContext";
import { Selection } from "@nextui-org/react";

export default function InvoiceContextProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [invoice, setInvoice] = useState<Pageable<InvoiceDTO>>();
  const [isLoading, setIsLoading] = useState(true);
  const [filterValue, setFilterValue] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const page = searchParams.get("page")
    ? Number(searchParams.get("page")) - 1
    : 0;
  const size = searchParams.get("size") ? Number(searchParams.get("size")) : 5;
  const searchString = searchParams.get("query") ?? undefined;
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
  const hasAvatarParam = searchParams.get("moneyType")
    ? String(searchParams.get("moneyType"))
    : "";
  const [selection, setSelection] = useState<Selection>(
    new Set(filterParam.split(","))
  );
  const [hasAvatarValue, setHasAvatarValue] = useState<Selection>(
    new Set(hasAvatarParam?.split(", "))
  );

  const initValue = useMemo(
    () => ({
      invoice,
      setInvoice,
      isLoading,
      setIsLoading,
      filterValue,
      setFilterValue,
      selection,
      setSelection,
      hasAvatarValue,
      hasAvatarParam,
      setHasAvatarValue,
    }),
    [invoice, filterValue, isLoading, selection, hasAvatarParam, hasAvatarValue]
  );

  useEffect(() => {
    const filter: InvoiceStatusConstants[] = filterParam
      ? filterParam
          .split(",")
          .map((key) => key.trim().toUpperCase() as InvoiceStatusConstants)
          .filter((key) => Object.values(InvoiceStatusConstants).includes(key))
      : [];

    const paymentType: PaymentTypeConstants[] = filterParam
      ? hasAvatarParam
          .split(",")
          .map((key) => key.trim().toUpperCase() as PaymentTypeConstants)
          .filter((key) => Object.values(PaymentTypeConstants).includes(key))
      : [];
    const getInvoice = async () => {
      setIsLoading(true);
      const response = await getAllInvoice(
        page,
        size,
        ["createdAt,desc"],
        searchString,
        filter,
        paymentType,
        dateFrom,
        dateTo
      );
      if (!response.data) {
        toast.error("Failed to fetch invoice");
        setIsLoading(false);
        return;
      }
      setInvoice(response.data);
      setIsLoading(false);
    };

    getInvoice();
  }, [page, size, filterParam, searchString, dateFrom, dateTo, hasAvatarParam]);

  return (
    <InvoiceContext.Provider value={initValue}>
      {children}
    </InvoiceContext.Provider>
  );
}
