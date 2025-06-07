"use client";

import GroupActionButton from "@/components/molecules/table/GroupActionButton";
import TableWrapper from "@/components/molecules/table/TableWrapper";
import { Rest } from "@/components/type";
import { StaffDTO } from "@/dtos/staff/StaffDTO";
import { useMeaningfulContext } from "@/hooks";
import { Chip, User } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { StaffContext } from "../context/StaffContext";

const StaffTable: React.FC = () => {
  const router = useRouter();

  const { isLoading, staffs } = useMeaningfulContext(StaffContext);
  const data = staffs;

  const columns = [
    { name: "Staff", key: "staff", align: "start" },
    { name: "Specialization", key: "courses", align: "start" },
    { name: "Teaching Availability", key: "schedules", align: "start" },
    { name: "Roles", key: "roles", align: "start" },
    { name: "Weekly Hour/Rates", key: "weeklyHoursRates", align: "start" },
    { name: "Action", key: "Action" },
  ];

  const renderCell = (key: string, data: StaffDTO) => {
    switch (key) {
      case "staff":
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
            name={`${data.firstName} ${data.lastName}`}
          >
            {data.emailAddress}
          </User>
        );
      case "courses":
        return (
          <div>
            {data?.courses?.map((course) => (
              <Chip size="sm" color="primary" variant="flat" key={course.code}>
                {course.name}
              </Chip>
            ))}
          </div>
        );
      case "schedules":
        return (
          <div>
            {data?.schedules?.map((schedule) => (
              <Chip size="sm" color="primary" variant="flat" key={schedule.id}>
                {schedule.code}
              </Chip>
            ))}
          </div>
        );
      case "roles":
        return (
          <div>
            {data?.roles?.map((role) => (
              <Chip size="sm" color="secondary" key={role.id}>
                {role.name}
              </Chip>
            ))}
          </div>
        );
      case "weeklyHoursRates":
        return (
          <div>
            <p className="text-md">{data?.weeklyHours}</p>
            <p className="text-xs text-zinc-600">{data?.rates} (VND)</p>
          </div>
        );
      case "Action":
        return <GroupActionButton detailId={data.id} />;
    }
  };

  const rest: Rest | undefined = data;

  return (
    <TableWrapper<StaffDTO>
      rest={rest}
      columns={columns}
      data={data?.content}
      renderCell={renderCell}
      isLoading={isLoading}
      onNew={() => router.push("/settings/staffs/new")}
    />
  );
};

export default StaffTable;
