import { RoleDTO, StaffDTO } from "@/dtos";
import { Pageable } from "@/dtos/base";
import { useMeaningfulContext } from "@/hooks";
import { getAllRoles } from "@/services/RoleService";
import { getFilteredStaffs } from "@/services/StaffService";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";
import DropdownForm from "./Dropdown";
import { DropdownContext } from "./DropdownContextProvider";
type Props = {
  staffs?: Pageable<StaffDTO>;
  requiredRoles?: ROLES[];
  scheduleIds?: number[];
  utilities?: React.ReactNode;
};

export enum ROLES {
  ACCOUNTANT = "ACCOUNTANT",
  ADMIN = "ADMIN",
  ACADEMIC_STAFF = "ACADEMIC_STAFF",
  TEACHER = "TEACHER",
}
export default function StaffDropdown({
  staffs: defaultStaff,
  scheduleIds,
  utilities,
  requiredRoles = [
    ROLES.TEACHER,
    ROLES.ACADEMIC_STAFF,
    ROLES.ADMIN,
    ROLES.ACCOUNTANT,
  ],
}: Readonly<Props>) {
  const { searchValue, selected, setOptions, setLoading, loading } =
    useMeaningfulContext(DropdownContext);
  const [roles, setRoles] = useState<RoleDTO[]>();
  const [staffs, setStaffs] = useState(defaultStaff);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    const getRoles = async () => {
      if (!loadingRole) {
        setLoadingRole(true);
      }
      const response = await getAllRoles(0, 1000000);
      setLoadingRole(false);
      if (!response.data) {
        toast.error("Failed to fetch roles");
        return;
      }
      const roles = response.data.content.filter((r) =>
        requiredRoles.includes(r.name as ROLES)
      );
      setRoles(roles);
    };

    if (!roles) {
      getRoles();
    }
  }, [requiredRoles]);

  useEffect(() => {
    const getStaff = async () => {
      if (!loading) {
        setLoading(true);
      }

      const response = await getFilteredStaffs(0, 6, {
        query: searchValue,
        roleIds: roles?.map((r) => r.id),
        scheduleIds: scheduleIds,
      });
      setLoading(false);
      if (!response.data) {
        toast.error("Failed to fetch staffs");
        return;
      }

      setStaffs(response.data);

      setOptions(
        response.data.content.map((staff) => ({
          key: `${staff.firstName} ${staff.lastName}`,
          value: staff.id.toString(),
        }))
      );
    };

    if (!loadingRole) {
      getStaff();
    }
  }, [searchValue, loadingRole, scheduleIds]);

  return (
    <DropdownForm utilities={utilities}>
      {staffs?.content
        .filter((s) =>
          selected.length === 0 ? true : s.id !== Number(selected[0].value)
        )
        .slice(0, 5)
        .map((staff) => (
          <Fragment key={staff.id}>
            <p className="text-xs opacity-50">{staff.code}</p>
            <p className="font-bold">
              {staff.firstName} {staff.lastName}
            </p>
          </Fragment>
        ))}
    </DropdownForm>
  );
}
