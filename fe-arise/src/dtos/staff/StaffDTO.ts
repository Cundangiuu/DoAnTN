import { AuditInfoDTO } from "../base";
import { CourseDTO } from "../course";
import { ScheduleDTO } from "../schedule/ScheduleDTO";
import { RoleDTO } from "./RoleDTO";

export type StaffDTO = {
  id: number;
  code: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  refreshToken: string;
  weeklyHours: number;
  avatarUrl: string;
  rates: number;
  schedules: ScheduleDTO[];
  courses: CourseDTO[];
  roles: RoleDTO[];
} & AuditInfoDTO;

export const defaultStaff: StaffDTO = {
  id: 0,
  code: "",
  firstName: "",
  lastName: "",
  emailAddress: "",
  phoneNumber: "",
  refreshToken: "",
  weeklyHours: 0,
  avatarUrl: "",
  rates: 0,
  schedules: [],
  courses: [],
  roles: [],
  createdAt: new Date(),
  createdBy: "",
  updatedAt: new Date(),
  updatedBy: "",
  isDelete: false,
};
