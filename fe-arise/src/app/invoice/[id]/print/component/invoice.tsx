"use client";

import { InvoiceDTO } from "@/dtos/invoice/InvoiceDTO";
import { formatToVND } from "@/utils/CurrencyFormat";
import { DateToStringWithoutTime } from "@/utils/DateUtils";
import VNnum2words from "vn-num2words";

type InvoiceProps = {
  id: number;
  invoice: InvoiceDTO;
  check: boolean;
};

export default function Invoice({
  invoice,
  check,
  id,
}: Readonly<InvoiceProps>) {
  return (
    <div className="bg-white w-[297mm] h-[200mm] mx-auto px-20 py-20 border border-gray-300 shadow-md text-sm overflow-hidden">
      <header className="text-center mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-12 mr-4" />
          </div>
          <div className="text-center">
            <p className="font-semibold mb-1">
              ARISE FOREIGN LANGUAGE CENTER
            </p>
            <p>Ha Huy Tap, Buon Ma Thuot City, Dak Lak</p>
          </div>
          <div className="text-right">
            <p>Arise - Education</p>
          </div>
        </div>
        <h1 className="text-2xl font-bold mt-4">RECEIPT</h1>
      </header>

      <section className="mb-4 max-h-[50mm] overflow-hidden">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p>
              Student Name:
              <span className="font-semibold">
                {invoice.studentName} ({invoice.studentNickName})
              </span>
            </p>
            <p>
              Phone Number:
              <span className="font-semibold">
                {invoice.studentPhoneNumber}
              </span>
            </p>
            <p>
              Collector Name:
              <span className="font-semibold">{invoice.staffName}</span>
            </p>
          </div>
          <div className="text-left">
            <p>
              Copy {id}: {check ? `Given to Parent` : `Kept by Creator`}
            </p>
            <p>Book Number:</p>
            <p>Invoice Number:</p>
          </div>
          <div className="text-left">
            <p>Student ID: {invoice.studentCode}</p>
            <p>Receipt ID: {invoice.id}</p>
            <p>Receipt Date: {DateToStringWithoutTime(new Date())}</p>
            <p>Attempt Number: {invoice.invoiceAttempt}</p>
          </div>
        </div>
      </section>

      {/* Table Section */}
      <table className="table-auto w-full border-collapse border border-black text-center mb-4">
        <thead>
          <tr>
            <th className="border border-black px-2 py-1">No.</th>
            <th className="border border-black px-2 py-1">Description</th>
            <th className="border border-black px-2 py-1">Unit</th>
            <th className="border border-black px-2 py-1">Quantity</th>
            <th className="border border-black px-2 py-1">
              Unit Price (VND)
            </th>
            <th className="border border-black px-2 py-1">Discount</th>
            <th className="border border-black px-2 py-1">Amount (VND)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black px-2 py-1">1</td>
            <td className="border border-black px-2 py-1">
              {invoice.className}
            </td>
            <td className="border border-black px-2 py-1">Course</td>
            <td className="border border-black px-2 py-1">1</td>
            <td className="border border-black px-2 py-1">
              {formatToVND(invoice.tuitionCourseOwed)}
            </td>
            <td className="border border-black px-2 py-1">
              {invoice.discount
                ? formatToVND(invoice.invoiceDiscount + (invoice.discount.amount * invoice.tuitionCourseOwed) / 100)
                : formatToVND(invoice.invoiceDiscount)}
            </td>
            <td className="border border-black px-2 py-1">
              {formatToVND(invoice.tuitionOwed - invoice.invoiceDiscount)}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td
              colSpan={5}
              rowSpan={4}
              className="border border-black px-2 py-1 text-left align-top"
            >
              <p>
                <span className="font-semibold">Actual Collection:</span>
                {formatToVND(invoice.amount)}
              </p>
              <p>
                <span className="font-semibold">In Words:</span>
                {VNnum2words(invoice.amount)} dong
              </p>
            </td>
            <td className="border border-black px-2 py-1 text-right font-semibold">
              Total Amount:
            </td>
            <td className="border border-black px-2 py-1">
              {formatToVND(invoice.tuitionOwed - invoice.invoiceDiscount)}
            </td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 text-right font-semibold">
              Payment:
            </td>
            <td className="border border-black px-2 py-1">
              {formatToVND(invoice.amount)}
            </td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 text-right font-semibold">
              Remaining:
            </td>
            <td className="border border-black px-2 py-1">
              {formatToVND(
                invoice.tuitionOwed - invoice.amount - invoice.invoiceDiscount
              )}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Footer Section */}
      <footer>
        <p className="mb-4">Notes:</p>
        <div className="flex justify-between">
          <div className="text-center">
            <p className="text-base font-bold">Payer</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold">Receipt Creator</p>
          </div>
        </div>
      </footer>
    </div>
  );
}