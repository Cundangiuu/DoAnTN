"use client";

import { SessionContext } from "@/contexts/SessionContext";
import { useMeaningfulContext } from "@/hooks";
import { updateSearchParams } from "@/utils/UrlUtil";
import { DateValue, getLocalTimeZone, now } from "@internationalized/date";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  RangeValue,
  Selection,
} from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IconType } from "react-icons";
import { CiExport } from "react-icons/ci";
import { HiOutlinePlus } from "react-icons/hi";
import { IoMdPrint, IoMdSearch } from "react-icons/io";
import { IoChevronDownOutline, IoSearchOutline } from "react-icons/io5";
import { useDebounceCallback } from "usehooks-ts";
import DateRangePicker from "../form/DateRangePicker";
import { DtoType, FilterOptionType, Rest, TablePaginationType } from "../types";
import CustomTable from "./CustomTable";

export type PrintOption = {
  label: React.ReactNode;
  type: string;
  icon: IconType;
  action: () => void;
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "default";
};
type Inputs = {
  Range: RangeValue<DateValue>;
};

type Props<T> = {
  rest?: Rest;
  columns: {
    name: string;
    key: string;
  }[];
  renderCell: (key: string, data: T) => JSX.Element | undefined;
  data?: T[];
  isLoading: boolean;
  isExport?: () => void;
  filterValue?: string | null;
  setFilterValue?: (filterValue: string | null) => void;
  onNew?: () => void;
  onPrint?: PrintOption[];
  onPrintFunction?: () => void;
  filterOptions?: FilterOptionType;
  showControls?: boolean;
  showInfo?: boolean;
  rowPerPageInfo?: boolean;
  showDateFilter?: boolean;
  secondaryFilterOption?: FilterOptionType;
  onChangePage?: (page: number) => void;
  disabled?: boolean;
};

const TableWrapper = <T extends DtoType>({
  rest,
  columns,
  renderCell,
  data,
  isLoading,
  isExport,
  filterValue,
  setFilterValue,
  onNew,
  onPrint,
  onPrintFunction,
  filterOptions,
  showControls,
  showInfo = true,
  rowPerPageInfo = true,
  showDateFilter,
  onChangePage,
  secondaryFilterOption,
  disabled,
}: Props<T>): JSX.Element => {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const params = useMemo(() => {
    return new URLSearchParams(Array.from(searchParams));
  }, [searchParams]);
  const { control, handleSubmit } = useForm<Inputs>();
  const { isTeacher } = useMeaningfulContext(SessionContext);

  const onSubmit: SubmitHandler<Inputs> = useMemo(
    () => async (data: Inputs) => {
      const { Range } = data;
      const start = Range.start.toDate(getLocalTimeZone());
      start.setHours(0, 0, 0, 0);

      const end = Range.end.toDate(getLocalTimeZone());
      end.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() + 1);
      const updatedParams = updateSearchParams(
        new URLSearchParams(params.toString()),
        {
          page: "1",
          dateFrom: start.toISOString(),
          dateTo: end.toISOString(),
        }
      );
      router.push(`${path}?${updatedParams}`);
    },
    [params, router, path]
  );

  const paginationInfo: TablePaginationType = {
    size: rest?.size ?? 5,
    number: rest?.number ?? 0,
    sort: [],
    numberOfElements: rest?.numberOfElements ?? 0,
    totalPages: rest?.totalPages ?? 0,
    totalElements: rest?.totalElements ?? 0,
    first: rest?.first,
    last: rest?.last,
    onFirst() {
      params.set("page", "1");
      router.push(`${path}?${params.toString()}`);
      if (onChangePage) {
        onChangePage(1);
      }
    },
    onLast() {
      const page = rest ? rest.totalPages.toString() : "0";
      params.set("page", page);
      router.push(`${path}?${params.toString()}`);
      if (onChangePage) {
        onChangePage(Number(page));
      }
    },
    onNext() {
      const page = Number(params.get("page") ?? "1") + 1;
      params.set("page", Math.min(page, rest ? rest.totalPages : 0).toString());
      router.push(`${path}?${params.toString()}`);
      if (onChangePage) {
        onChangePage(Math.min(page, rest ? rest.totalPages : 0));
      }
    },
    onPrevious() {
      const page = Number(params.get("page") ?? "1") - 1;
      params.set("page", Math.max(page, 1).toString());
      router.push(`${path}?${params.toString()}`);
      if (onChangePage) {
        onChangePage(Math.max(page, 1));
      }
    },
    onClickAnchor(index) {
      params.set("page", index.toString());
      router.push(`${path}?${params.toString()}`);
      if (onChangePage) {
        onChangePage(index);
      }
    },
  };

  const onSearchChange = useDebounceCallback((filter: string) => {
    if (setFilterValue) setFilterValue(filter);
    const updatedParams = updateSearchParams(
      new URLSearchParams(params.toString()),
      {
        page: "1",
        query: filter,
      }
    );

    router.push(`${path}?${updatedParams}`);
  }, 1000);

  const onRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      params.set("size", event.target.value);
      router.push(`${path}?${params.toString()}`);
    },
    [path, params, router]
  );

  const selectedValue = (
    options: { key: string; label: string }[],
    selectedKeys: Selection
  ) => {
    return options
      .map((opt) => {
        if (Array.from(selectedKeys).includes(opt.key)) return opt.label;
      })
      .filter((label): label is string => label !== undefined)
      .toString();
  };

  const selectedSecondValue = (
    options: { key: string; label: string }[],
    selectedKeys: Selection
  ) => {
    return options
      .map((opt) => {
        if (Array.from(selectedKeys).includes(opt.key)) return opt.label;
      })
      .filter((label): label is string => label !== undefined)
      .toString();
  };

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          {setFilterValue ? (
            <Input
              isClearable
              classNames={{
                base: "w-full sm:max-w-[44%]",
                inputWrapper: "border-1",
              }}
              placeholder="Search by name..."
              size="sm"
              startContent={<IoSearchOutline />}
              defaultValue={filterValue ?? ""}
              variant="bordered"
              onClear={() => setFilterValue("")}
              onValueChange={onSearchChange}
            />
          ) : (
            <div></div>
          )}
          {showDateFilter && (
            <div className="flex gap-3">
              <form
                className="flex gap-2 items-end"
                onSubmit={handleSubmit(onSubmit)}
              >
                <DateRangePicker
                  control={control}
                  name="Range"
                  showLabel={false}
                  defaultValue={{
                    start: now(getLocalTimeZone()),
                    end: now(getLocalTimeZone()),
                  }}
                />
                <Button disabled={disabled} isIconOnly type="submit">
                  <IoMdSearch />
                </Button>
              </form>
            </div>
          )}
          <div className="flex gap-3">
            {secondaryFilterOption?.map((option) => (
              <Dropdown key={option.options.toString()}>
                <DropdownTrigger>
                  <Button
                    disabled={disabled}
                    endContent={<IoChevronDownOutline className="text-small" />}
                    size="sm"
                    className="capitalize"
                    variant="flat"
                  >
                    {option.label}
                    {": "}
                    {option.options
                      ? selectedSecondValue(
                          option.options,
                          option.props.selectedKeys
                        )
                      : option.label}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu closeOnSelect={false} {...option.props}>
                  {option.options.map((opt) => (
                    <DropdownItem key={opt.key}>{opt.label}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            ))}
          </div>

          <div className="flex gap-3">
            {filterOptions?.map((option) => (
              <Dropdown key={option.options.toString()}>
                <DropdownTrigger className="hidden sm:flex">
                  <Button
                    disabled={disabled}
                    endContent={<IoChevronDownOutline className="text-small" />}
                    size="sm"
                    className="capitalize"
                    variant="flat"
                  >
                    {option.label}
                    {": "}
                    {option.options
                      ? selectedValue(option.options, option.props.selectedKeys)
                      : option.label}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu closeOnSelect={false} {...option.props}>
                  {option.options.map((opt) => (
                    <DropdownItem key={opt.key}>{opt.label}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            ))}
            {onNew && !isTeacher && (
              <Button
                disabled={disabled}
                onPress={onNew}
                color="primary"
                endContent={<HiOutlinePlus />}
                size="sm"
              >
                Add New
              </Button>
            )}
            {onPrintFunction && (
              <Button
                disabled={disabled}
                size="sm"
                color="success"
                startContent={<IoMdPrint />}
                onPress={onPrintFunction}
              >
                Print
              </Button>
            )}
            {onPrint?.map((option) =>
              typeof option.label === "string" ||
              typeof option.label == "number" ? (
                <Button
                  disabled={disabled}
                  key={option.type}
                  onPress={option.action}
                  startContent={<option.icon />}
                  color={option.color ?? "success"}
                  size="sm"
                >
                  {option.label}
                </Button>
              ) : (
                option.label
              )
            )}
            {isExport && (
              <Button
                disabled={disabled}
                onPress={isExport}
                startContent={<CiExport size={15} className="flex-shrink-0" />}
                color="success"
                size="sm"
                className="w-20"
              >
                Export
              </Button>
            )}
          </div>
        </div>
        {showInfo && (
          <div className="flex justify-between items-center">
            {paginationInfo.totalElements === 0 ? (
              <span className="text-default-400 text-small">
                Total 0 / 0 records
              </span>
            ) : (
              <span className="text-default-400 text-small">
                Total {paginationInfo.numberOfElements ?? 0} /{" "}
                {paginationInfo.totalElements} records
              </span>
            )}

            {rowPerPageInfo && (
              <label className="flex items-center text-default-400 text-small">
                Rows per page:
                <select
                  className="bg-transparent outline-none text-default-400 text-small"
                  onChange={onRowsPerPageChange}
                  value={rest?.size}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                </select>
              </label>
            )}
          </div>
        )}
      </div>
    );
  }, [
    setFilterValue,
    filterValue,
    onSearchChange,
    filterOptions,
    onNew,
    isTeacher,
    isExport,
    onPrint,
    onPrintFunction,
    showInfo,
    data?.length,
    onRowsPerPageChange,
    rest?.size,
    showDateFilter,
    control,
    handleSubmit,
    onSubmit,
    secondaryFilterOption,
  ]);

  const normalizedData = data?.map((item) => ({ ...item }));

  return (
    <CustomTable<T>
      columns={columns}
      data={normalizedData}
      renderCell={renderCell}
      paginationInfo={paginationInfo}
      isLoading={isLoading}
      topContent={topContent}
      showControl={showControls}
    />
  );
};

export default TableWrapper;
