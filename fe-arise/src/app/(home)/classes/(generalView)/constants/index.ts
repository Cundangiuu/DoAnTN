import { FilterOptionType } from "@/components/type";
import { ClassStatus } from "@/constants/class";
import { Selection } from "@nextui-org/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const selectOptions: FilterOptionType[0]["options"] = [
  { key: "all", label: "All" },
  { key: ClassStatus.NEW, label: "New" },
  { key: ClassStatus.ON_GOING, label: "Ongoing" },
  { key: ClassStatus.ENDED, label: "Ended" },
];

export const columns = [
  { name: "Class Code", key: "code", align: "start" },
  { name: "Class Name", key: "name" },
  { name: "Schedule", key: "schedules" },
  { name: "Instructor", key: "staff" },
  { name: "Class Information", key: "classInfo" },
  { name: "Start Date", key: "startDate" },
  { name: "Location", key: "location" },
  { name: "Actions", key: "Action" },
];

export const getFilterOptions = (
  selection: Selection,
  params: URLSearchParams,
  path: string,
  router: AppRouterInstance
) =>
  [
    {
      label: "Status",
      props: {
        selectedKeys: selection,
        selectionMode: "single",
        onSelectionChange: (selection: Selection) => {
          const selected = Array.from(selection);

          if (selected.length === 2 || selected.length === 0) {
            params.delete("status");
          } else {
            params.set("status", selected[0].toString());
          }

          params.delete("page");

          router.push(`${path}?${params.toString()}`);
        },
      },
      options: selectOptions,
    },
  ] satisfies FilterOptionType;