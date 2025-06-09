import { FilterOptionType } from "@/components/type";
import { ClassStatus } from "@/constants/class";
import { Selection } from "@nextui-org/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const selectOptions: FilterOptionType[0]["options"] = [
  { key: "all", label: "Tất cả" },
  { key: ClassStatus.NEW, label: "Mới" },
  { key: ClassStatus.ON_GOING, label: "Đang diễn ra" },
  { key: ClassStatus.ENDED, label: "Đã kết thúc" },
];

export const columns = [
  { name: "Mã lớp", key: "code", align: "start" },
  { name: "Tên lớp", key: "name" },
  { name: "Lịch học", key: "schedules" },
  { name: "Giảng viên", key: "staff" },
  { name: "Thông tin lớp", key: "classInfo" },
  { name: "Ngày bắt đầu", key: "startDate" },
  { name: "Địa điểm", key: "location" },
  { name: "Hành động", key: "Action" },
];

export const getFilterOptions = (
  selection: Selection,
  params: URLSearchParams,
  path: string,
  router: AppRouterInstance
) =>
  [
    {
      label: "Trạng thái",
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