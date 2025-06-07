import { Suspense } from "react";
import InvoiceContextProvider from "./context";
import InvoiceTable from "./component/InvoiceTable";
import InvoiceInfo from "./component/InvoiceInfo";

export default function AccountingPage() {
  return (
    <Suspense>
      <InvoiceInfo/>
      <InvoiceContextProvider>
        <InvoiceTable />
      </InvoiceContextProvider>
    </Suspense>
  );
}
