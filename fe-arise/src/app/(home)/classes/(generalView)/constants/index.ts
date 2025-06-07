import { FilterOptionType } from "@/components/type";
import { ClassStatus } from "@/constants/class";
import { Selection } from "@nextui-org/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const selectOptions: FilterOptionType[0]["options"] = [
  { key: "all", label: "ALL" },
  { key: ClassStatus.NEW, label: "New" },
  { key: ClassStatus.ON_GOING, label: "On going" },
  { key: ClassStatus.ENDED, label: "Ended" },
];

export const columns = [
  { name: "Code", key: "code", align: "start" },
  { name: "Name", key: "name" },
  { name: "Schedules", key: "schedules" },
  { name: "Academic Staff", key: "staff" },
  { name: "Class info", key: "classInfo" },
  { name: "Start Date", key: "startDate" },
  { name: "Location", key: "location" },
  { name: "Action", key: "Action" },
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
