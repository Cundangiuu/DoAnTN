import {
  CourseDTO,
  DiscountDTO,
  DiscountRequestDTO,
  GradeDTO,
  HolidayDTO,
  HolidayRequestDTO,
  LocationDTO,
  LocationRequestDTO,
  ScheduleDTO,
  ScheduleRequestDTO,
  StaffDTO,
  StudentDTO,
  StudentRequestDTO,
} from "@/dtos";
import { AbsenceDTO } from "@/dtos/absence/AbsenceDTO";
import { PageableInfo, Sort } from "@/dtos/base";
import { ClassDayDTO } from "@/dtos/classDay/ClassDayDTO";
import { ClassDTO } from "@/dtos/classes/ClassDTO";
import { EnrollmentDTO } from "@/dtos/enrollment/EnrollmentDTO";
import { FormulaDTO } from "@/dtos/formula/FormulaDTO";

import { InvoiceDTO } from "@/dtos/invoice/InvoiceDTO";
import { LessonDTO } from "@/dtos/lesson/LessonDTO";
import { StudentGradeDTO } from "@/dtos/student/StudentGradeDTO";
import { Selection } from "@nextui-org/react";
export type TableType<T extends TableDataType> = {
  data: T[];
  pagination?: boolean;
  paginationInfo?: TablePaginationType;
  options?: TableOptions;
  onClickTitle: (title: string) => void;
};

export type TableDataType = { [ObjKey: string]: React.ReactNode } & {
  key?: string;
};

export type TablePaginationType = {
  size: number;
  number: number;
  sort: TableSortingType[];
  totalPages: number;
  totalElements: number;
  first?: boolean;
  last?: boolean;
  numberOfElements: number;
  onNext: () => void;
  onPrevious: () => void;
  onLast: () => void;
  onFirst: () => void;
  onClickAnchor: (index: number) => void;
};

export type TableSortingType = {
  [attr: string]: "ASC" | "DESC";
};

export type TableOptions = {
  anchorCount?: number;
};

export type Rest = {
  totalPages: number;
  totalElements: number;
  pageable: PageableInfo;
  size: number;
  number: number;
  sort: Sort[];
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
};

export type DataType = { [key: string]: string | number };

export type DtoType =
  | DiscountDTO
  | LocationDTO
  | ScheduleDTO
  | StudentDTO
  | HolidayDTO
  | CourseDTO
  | StaffDTO
  | AbsenceDTO
  | InvoiceDTO
  | ClassDTO
  | GradeDTO
  | FormulaDTO
  | EnrollmentDTO
  | LessonDTO
  | ClassDayDTO
  | DataType
  | StudentGradeDTO;

export type DtoReqType =
  | DiscountRequestDTO
  | LocationRequestDTO
  | ScheduleRequestDTO
  | StudentRequestDTO
  | HolidayRequestDTO;

export type ColumnType = {
  name: string;
  key: string;
  align?: "center" | "start" | "end";
}[];

export type FilterOptionType = {
  label: string;
  props: {
    disallowEmptySelection?: boolean;
    selectedKeys: Selection;
    selectionMode: "none" | "single" | "multiple";
    onSelectionChange: (value: Selection) => void;
  };
  options: {
    key: string;
    label: string;
  }[];
}[];
