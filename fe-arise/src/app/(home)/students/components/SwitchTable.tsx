"use client";

import { SessionContext } from "@/contexts";
import { useMeaningfulContext } from "@/hooks";
import { Tab, Tabs } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import AttendanceTable from "./AttendanceTable";
import EnrollmentTable from "./EnrollmentTable";
import GradeTable from "./GradeTable";
import InvoiceTable from "./InvoiceTable";

type props = {
  studentCode: string;
  studentId: number;
};

export default function SwitchTable({
  studentCode,
  studentId,
}: Readonly<props>) {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState(
    searchParams.get("tab") || "enrollment"
  );
  const { isTeacher } = useMeaningfulContext(SessionContext);

  return (
    <div className="w-full flex gap-3 flex-col mt-8 bg-slate-50 p-4 rounded-md">
      <Tabs
        aria-label="Infos"
        color="primary"
        selectedKey={selected}
        onSelectionChange={(key) => setSelected(key.toString())}
      >
        <Tab key={"enrollment"} title={"Enrollment"}>
          <EnrollmentTable isReadonly={true} studentCode={studentCode} />
        </Tab>
        <Tab key={"attendance"} title={"Attendance"}>
          <AttendanceTable isReadonly={true} studentCode={studentCode} />
        </Tab>
        {!isTeacher && (
          <Tab key={"invoice"} title={"Invoice"}>
            <InvoiceTable isReadonly={true} studentCode={studentCode} />
          </Tab>
        )}
        <Tab key={"grade"} title={"Grade"}>
          <GradeTable studentId={studentId} />
        </Tab>
      </Tabs>
    </div>
  );
}
