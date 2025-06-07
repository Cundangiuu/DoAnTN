import GroupActionButton from "@/components/molecules/table/GroupActionButton";
import TableWrapper from "@/components/molecules/table/TableWrapper";
import { Rest } from "@/components/type";
import { HolidayDTO } from "@/dtos/holiday/HolidayDTO";
import { useMeaningfulContext } from "@/hooks";
import { DateToStringWithoutTime } from "@/utils/DateUtils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HolidayContext } from "../context/HolidayContext";

const HolidayTable = () => {
  const router = useRouter();
  const { holidays, isLoading } = useMeaningfulContext(HolidayContext);
  const data = holidays;

  const columns = [
    { name: "Name", key: "holidayType", align: "start" },
    { name: "Description", key: "description" },
    { name: "Start Date", key: "startDate" },
    { name: "End Date", key: "endDate" },
    { name: "Action", key: "Action" },
  ];

  const renderCell = (key: string, data: HolidayDTO) => {
    const cellValue = data[key as keyof HolidayDTO];

    switch (key) {
      case "holidayType":
        return (
          <Link
            href={`/settings/holidays/${data.id}`}
            className="text-blue-600 underline"
          >
            {cellValue?.toString()}
          </Link>
        );
      case "description":
        return (
          <div className="flex justify-center items-center">
            {cellValue?.toString()}
          </div>
        );
      case "startDate":
        return (
          <div className="flex justify-center items-center">
            {DateToStringWithoutTime(cellValue as Date)}
          </div>
        );
      case "endDate":
        return (
          <div className="flex justify-center items-center">
            {DateToStringWithoutTime(cellValue as Date)}
          </div>
        );
      case "Action":
        return <GroupActionButton detailId={data.id} />;
    }
  };

  const rest: Rest | undefined = data;

  return (
    <TableWrapper
      rest={rest}
      columns={columns}
      data={data?.content}
      renderCell={renderCell}
      isLoading={isLoading}
      onNew={() => router.push("/settings/holidays/new")}
    />
  );
};

export default HolidayTable;
