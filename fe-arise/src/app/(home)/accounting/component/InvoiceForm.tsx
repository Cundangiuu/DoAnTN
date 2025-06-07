"use client";

import FormContextProvider from "@/app/(home)/classes/(utilities)/new/component/Form/FormContext";
import {
  InvoiceDTO,
  InvoiceStatusConstants,
  PaymentTypeConstants,
} from "@/dtos/invoice/InvoiceDTO";
import { InvoiceRequest } from "@/dtos/invoice/InvoiceRequest";
import { updateInvoice } from "@/services/InvoiceService";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface Props {
  isReadonly?: boolean;
  isDisabled?: boolean;
  defaultInvoiceDTO?: InvoiceDTO;
}

export default function InvoiceForm({
  isReadonly,
  isDisabled,
  defaultInvoiceDTO,
}: Readonly<Props>) {
  const router = useRouter();

  const [invoiceDiscount, setInvoiceDiscount] = useState(
    defaultInvoiceDTO?.invoiceDiscount?.toString() || ""
  );
  const tuitionOwed = defaultInvoiceDTO?.tuitionOwed || 0;
  const [amount, setAmount] = useState(
    defaultInvoiceDTO?.amount.toString() || ""
  );

  const validateDiscount = (value: string) => {
    const discount = parseFloat(value) || 0;
    return discount <= tuitionOwed;
  };

  const isInvalid = useMemo(() => {
    if (invoiceDiscount === "") return false;
    return !validateDiscount(invoiceDiscount);
  }, [invoiceDiscount, tuitionOwed]);

  const validateAmount = (value: string) => {
    const amount = parseFloat(value) || 0;
    return amount <= maxAmountPaid;
  };

  const maxAmountPaid = useMemo(() => {
    return tuitionOwed - (parseFloat(invoiceDiscount) || 0);
  }, [tuitionOwed, invoiceDiscount]);

  const onSubmit = async (formData: FormData) => {
    const amount = parseFloat((formData.get("amount") as string) || "");
    const description = (formData.get("description") as string) || "";
    const paymentType = formData.get("paymentType") as PaymentTypeConstants;

    try {
      const invoiceId = defaultInvoiceDTO?.id ?? 0;

      const invoiceRequest: InvoiceRequest = {
        invoiceId: invoiceId,
        amount: amount,
        invoiceDiscount: parseFloat(invoiceDiscount) || 0,
        description: description,
        paymentType: paymentType,
      };

      const response = await updateInvoice(invoiceRequest);
      if (!response.data) {
        toast.error(`Failed to update invoice`);
      } else {
        toast.success("Invoice updated successfully");
        router.push(`/accounting/${invoiceId}`);
      }
    } catch (error) {
      console.error("Error submitting the form: ", error);
      toast.error(`Failed to update invoice`);
    }
  };

  return (
    <FormContextProvider>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          onSubmit(formData);
        }}
      >
        <div className="w-full flex gap-3 justify-between">
          <h1 className="text-2xl font-bold mb-4">Invoice</h1>
          {!(isDisabled || isReadonly) && (
            <Button color="primary" type="submit">
              Save
            </Button>
          )}
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
          <Input
            isReadOnly={true}
            isDisabled={true}
            defaultValue={defaultInvoiceDTO?.className}
            name="className"
            label="Enrolled Class (Lớp đã đăng ký)"
            labelPlacement="outside"
            variant="bordered"
            classNames={{ base: "w-full" }}
          />
          <Input
            isReadOnly={true}
            isDisabled={true}
            defaultValue={defaultInvoiceDTO?.tuitionOwed.toString()}
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">đ</span>
              </div>
            }
            name="tuitionOwed"
            label="Tuition Owed (Học phí còn nợ)"
            labelPlacement="outside"
            variant="bordered"
            classNames={{ base: "w-full" }}
          />
          <Input
            isReadOnly={isReadonly}
            isDisabled={isDisabled}
            defaultValue={
              (defaultInvoiceDTO?.invoiceStatus ===
                InvoiceStatusConstants.NOT_PAID && !isReadonly)
                ? (defaultInvoiceDTO.tuitionOwed - defaultInvoiceDTO.invoiceDiscount).toString()
                : defaultInvoiceDTO?.amount.toString()
            }
            onChange={(e) => setAmount(e.target.value)}
            isInvalid={!isReadonly && !validateAmount(amount)}
            errorMessage={
              !isReadonly && !validateAmount(amount)
                ? "Amount paid cannot be higher than (Tuition Owed - Discount)"
                : ""
            }
            name="amount"
            label="Amount Paid (Số tiền đã thanh toán)"
            labelPlacement="outside"
            variant="bordered"
            isRequired
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">đ</span>
              </div>
            }
            type="number"
            placeholder="0.00"
            classNames={{ base: "w-full" }}
          />
          <Input
            errorMessage={
              !isReadonly ? "Discount cannot be higher than tuition owed" : ""
            }
            onChange={(e) => setInvoiceDiscount(e.target.value)}
            defaultValue={defaultInvoiceDTO?.invoiceDiscount.toString()}
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">đ</span>
              </div>
            }
            isInvalid={!isReadonly && isInvalid}
            label="Invoice Discount (Giảm giá hóa đơn)"
            type="number"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter discount"
            isReadOnly={isReadonly}
            isDisabled={isDisabled}
          />
          <Select
            isDisabled={isDisabled}
            name="paymentType"
            label="Payment Type  (Loại thanh toán)"
            placeholder="Select Payment Type"
            className="w-full"
            labelPlacement="outside"
            defaultSelectedKeys={
              defaultInvoiceDTO?.paymentType
                ? [defaultInvoiceDTO.paymentType]
                : undefined
            }
          >
            {Object.values(PaymentTypeConstants).map((value) => (
              <SelectItem value={value} key={value}>
                {value}
              </SelectItem>
            ))}
          </Select>

          <Input
            className="w-full"
            isReadOnly={isReadonly}
            isDisabled={isDisabled}
            defaultValue={defaultInvoiceDTO?.description}
            name="description"
            label="Description (Mô tả)"
            placeholder="Enter a description"
            labelPlacement="outside"
            variant="bordered"
          />
        </div>
      </form>
    </FormContextProvider>
  );
}
