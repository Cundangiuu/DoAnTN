"use client";

import InvoiceStatus from "@/components/molecules/invoiceStatus";
import TableWrapper, {
  PrintOption,
} from "@/components/molecules/table/TableWrapper";
import { Rest } from "@/components/type";
import { SessionContext } from "@/contexts";
import { formatInvoiceStatus, InvoiceDTO } from "@/dtos/invoice/InvoiceDTO";
import { StudentDTO } from "@/dtos/student/StudentDTO";
import { useMeaningfulContext } from "@/hooks";
import { getInvoiceByClassId } from "@/services/InvoiceService";
import { getStudent } from "@/services/StudentService";
import { DateToStringWithoutTime } from "@/utils/DateUtils";
import { Spinner, User } from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PiStudent } from "react-icons/pi";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import DropdownWrapper from "./DropdownContextProvider";
import StudentDropdown from "./StudentDropdown";

export type Props = {
  classId?: number;
  classCode?: string;
  defaultStudents?: StudentDTO[];
  disabled?: boolean;
  isReadonly?: boolean;
  onChange?: (studentIds: number[]) => void;
};

type IndexedStudentDTO = StudentDTO & { index: number };

const StudentTable = ({
  classId,
  classCode,
  defaultStudents,
  disabled,
  isReadonly,
  onChange,
}: Props) => {
  const [data, setData] = useState(defaultStudents ?? []);
  const [invoices, setInvoices] = useState<InvoiceDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const { isTeacher } = useMeaningfulContext(SessionContext);

  const baseColumns = [
    { name: "No.", key: "index" },
    { name: "Name", key: "name", align: "start" },
    { name: "Code", key: "code" },
    { name: "Nickname", key: "nickname" },
    { name: "Phone Number", key: "phoneNumber" },
    { name: "Date Of Birth", key: "dateOfBirth" },
  ];

  useEffect(() => {
    const getInvoices = async () => {
      if (!classId) {
        toast.error("Class ID is required");
        return;
      }
      const response = await getInvoiceByClassId(classId);

      if (!response.data) {
        toast.error("Failed to get invoices");
        return;
      }

      setInvoices(response.data);
    };

    if (isReadonly && !isTeacher) {
      getInvoices();
    }
  }, [defaultStudents]);

  const columns =
    isTeacher || !isReadonly
      ? baseColumns
      : [...baseColumns, { name: "Tuition State", key: "tuition_state" }];

  const renderCell = (key: string, data: IndexedStudentDTO) => {
    const cellValue = data[key as keyof IndexedStudentDTO];

    switch (key) {
      case "index":
        return <p>{(cellValue as number) + 1}</p>;
      case "code":
        return (
          <Link
            href={`/students/${cellValue}`}
            className="text-blue-600 underline"
          >
            {cellValue?.toString()}
          </Link>
        );
      case "name":
        return (
          <User
            {...(data.avatarUrl
              ? {
                  avatarProps: {
                    src: `/api/images?filePath=${data.avatarUrl}`,
                  },
                }
              : {})}
            description={data.emailAddress}
            name={cellValue?.toString()}
          >
            {data.emailAddress}
          </User>
        );
      case "nickname":
        return (
          <div className="flex justify-center items-center">
            {cellValue?.toString()}
          </div>
        );
      case "phoneNumber":
        return (
          <div className="flex justify-center items-center">
            {cellValue?.toString()}
          </div>
        );
      case "dateOfBirth":
        return (
          <div className="flex justify-center items-center">
            {DateToStringWithoutTime(cellValue as Date)}
          </div>
        );
      case "tuition_state":
        const invoice = invoices.find((i) => i.studentCode === data.code);

        return invoice ? (
          <InvoiceStatus
            data={invoice}
            href={`/students/${data.code}?tab=invoice`}
          />
        ) : (
          <Spinner />
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

  const onChangeSelection = async (selected: string[]) => {
    const selection = selected.map(
      (s) => JSON.parse(s) as { id: string; code: string }
    );
    const codes = selection.map((s) => s.code);

    const newSelections = codes.filter(
      (s) => !data.map((d) => d.code).includes(s)
    );

    if (newSelections.length === 0) {
      const temp = structuredClone(data.filter((d) => codes.includes(d.code)));

      setData(temp);
    }

    if (onChange) {
      onChange(selection.map((t) => Number(t.id)));
    }

    for (const code of newSelections) {
      setLoading(true);
      const response = await getStudent(code);
      setLoading(false);

      if (!response.data) {
        toast.error("Failed to get student");
        return;
      }

      const temp = structuredClone(data);
      temp.push(response.data);

      setData(temp);
    }
  };

  const exportToExcel = () => {
    if (!data || data.length === 0) {
      alert("No data available to export.");
      return;
    }
    const formattedData = data.map((student, index) => ({
      No: index + 1,
      Name: student.name,
      Code: student.code,
      Nickname: student.nickname,
      "Phone Number": student.phoneNumber,
      "Date Of Birth": student.dateOfBirth,
      "Tuition State": formatInvoiceStatus(
        invoices.find((i) => i.studentCode === student.code)?.invoiceStatus
      ),
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Student-${classCode}`);

    XLSX.writeFile(workbook, `Student-${classCode}.xlsx`);
  };

  const dropdown: PrintOption[] | undefined = !isReadonly
    ? [
        {
          type: "button",
          icon: PiStudent,
          label: (
            <DropdownWrapper
              loading={loading}
              disabled={disabled}
              label="students"
              defaultLoading
              required
              defaultSelection={defaultStudents?.map((student) => ({
                key: `${student.code} - ${student.name} (${student.nickname})`,
                value: JSON.stringify({ code: student.code, id: student.id }),
              }))}
              selectionMode="multiple"
            >
              <StudentDropdown setSelected={onChangeSelection} />
            </DropdownWrapper>
          ),
          action: () => {},
        },
      ]
    : undefined;

  return (
    <TableWrapper<IndexedStudentDTO>
      rest={rest}
      columns={columns}
      renderCell={renderCell}
      data={data.map((d, i) => ({ ...d, index: i }))}
      isLoading={loading}
      showControls={false}
      isExport={exportToExcel}
      onPrint={dropdown}
      rowPerPageInfo={false}
    />
  );
};

export default StudentTable;
