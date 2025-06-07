import GroupActionButton from "@/components/molecules/table/GroupActionButton";
import TableWrapper from "@/components/molecules/table/TableWrapper";
import { Rest } from "@/components/type";
import { ScheduleDTO } from "@/dtos/schedule/ScheduleDTO";
import { useMeaningfulContext } from "@/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ScheduleContext } from "../context/ScheduleContext";

const ScheduleTable: React.FC = () => {
  const router = useRouter();
  const { schedules, isLoading } = useMeaningfulContext(ScheduleContext);
  const data = schedules;

  const columns = [
    { name: "Code", key: "code", align: "start" },
    { name: "Description", key: "description" },
    { name: "Action", key: "Action" },
  ];

  const renderCell = (key: string, data: ScheduleDTO) => {
    const cellValue = data[key as keyof ScheduleDTO];

    switch (key) {
      case "code":
        return (
          <Link
            href={`/settings/schedules/${data.id}`}
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
      onNew={() => router.push("/settings/schedules/new")}
    />
  );
};

export default ScheduleTable;
