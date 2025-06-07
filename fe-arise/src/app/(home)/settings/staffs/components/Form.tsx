"use client";

import { DeleteActionButton, ImageCropper } from "@/components";
import {
  EditButton,
  SelectInput,
  SubmitButton,
  TextInput,
} from "@/components/molecules/form";
import { ModalContext } from "@/contexts";
import { NewOrEditContext } from "@/contexts/NewOrEditContext";
import {
  CourseDTO,
  RoleDTO,
  ScheduleDTO,
  StaffDTO,
  StaffRequestDTO,
} from "@/dtos";
import { useMeaningfulContext } from "@/hooks";
import {
  CourseService,
  RoleService,
  ScheduleService,
  StaffService,
} from "@/services";
import { Avatar, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaCameraRetro } from "react-icons/fa";
import { toast } from "sonner";

type Props = {
  staff?: StaffDTO;
};

const Form: React.FC<Readonly<Props>> = ({ staff }) => {
  const router = useRouter();
  const [avatar, setAvatar] = useState<Blob>();
  const { showModal } = useMeaningfulContext(ModalContext);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const { isNew, isEdit } = useMeaningfulContext(NewOrEditContext);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isReadOnly = staff && !isEdit && !isNew;
  const [courses, setCourses] = useState<CourseDTO[]>();
  const [roles, setRoles] = useState<RoleDTO[]>();
  const [schedules, setSchedules] = useState<ScheduleDTO[]>();
  const [formSubmitting, setFormSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const coursesResponse = await CourseService.getAllCourse();
      const rolesResponse = await RoleService.getAllRoles();
      const schedulesResponse = await ScheduleService.getAllSchedules();

      setCourses(coursesResponse.data?.content);
      setRoles(rolesResponse.data?.content);
      setSchedules(schedulesResponse.data?.content);
    };

    fetchData();
  }, []);

  const { handleSubmit, control } = useForm<StaffRequestDTO>({
    defaultValues: {
      firstName: staff?.firstName,
      lastName: staff?.lastName,
      emailAddress: staff?.emailAddress,
      phoneNumber: staff?.phoneNumber,
      weeklyHours: staff?.weeklyHours,
      rates: staff?.rates,
      roleIds: staff?.roles.map((role) => role.id),
      courseIds: staff?.courses.map((course) => course.id),
      scheduleIds: staff?.schedules.map((schedule) => schedule.id),
    },
  });

  const onSubmit: SubmitHandler<StaffRequestDTO> = async (staffData) => {
    setFormSubmitting(true);
    const formData = new FormData();

    const staffRequest = {
      firstName: staffData.firstName,
      lastName: staffData.lastName,
      emailAddress: staffData.emailAddress,
      phoneNumber: staffData.phoneNumber,
      weeklyHours: staffData.weeklyHours,
      rates: staffData.rates,
      roleIds: staffData.roleIds,
      courseIds: staffData.courseIds,
      scheduleIds: staffData.scheduleIds,
    };

    formData.append(
      "staffRequest",
      new Blob([JSON.stringify(staffRequest)], { type: "application/json" })
    );

    if (avatar) {
      const fileName = `${Date.now()}.png`;
      formData.append("avatar", avatar, fileName);
    }

    try {
      const response = await (staff
        ? StaffService.updateStaff(formData, staff.id)
        : StaffService.createStaff(formData));

      if (!response.data) {
        toast.error(`Failed to ${staff ? "update" : "create"} staff`);
      } else {
        toast.success(`Staff ${staff ? "updated" : "created"} successfully!`);
        router.push(`/settings/staffs/${response.data.id}`);
      }
    } catch (error) {
      console.error("Error submitting the form: ", error);
      toast.error(`Failed to ${staff ? "update" : "create"} staff`);
    } finally {
      setFormSubmitting(false);
    }
  };

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const avatar = e.target.files?.[0];
    setAvatarUploading(true);
    if (avatar) {
      const maxFileSize = 10 * 1024 * 1024;
      if (avatar.size > maxFileSize) {
        toast.error("File size exceeds the 5MB limit.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const src = reader.result?.toString() || "";
        showModal(
          <ImageCropper
            imageSrc={src}
            setUploading={setAvatarUploading}
            setAvatar={setAvatar}
            circularCrop={true}
          />
        );
      };
      reader.readAsDataURL(avatar);
      setAvatarUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-3 my-5 justify-end">
        {!isEdit && !isNew ? (
          <EditButton
            href={`/settings/staffs/${(staff as StaffDTO)?.id}/edit`}
          />
        ) : (
          <SubmitButton isLoading={formSubmitting} />
        )}
        {staff && (
          <DeleteActionButton
            id={staff.id}
            action={StaffService.deleteStaff}
            objectName="Staff"
            afterDelete={() => router.push("/settings/staffs")}
          />
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="row-span-3 flex flex-col justify-start gap-3 items-center">
          {avatar ? (
            <Avatar
              src={URL.createObjectURL(avatar)}
              className="h-[80px] w-[80px]"
            />
          ) : staff?.avatarUrl ? (
            <Avatar
              src={`/api/images?filePath=${staff.avatarUrl}`}
              className="h-[80px] w-[80px]"
            />
          ) : (
            <Avatar
              className="h-[80px] w-[80px]"
              name={staff?.emailAddress ?? "avatar"}
            />
          )}
          <input
            className="hidden"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={onUpload}
          />
          <Button
            color="success"
            startContent={!avatarUploading && <FaCameraRetro />}
            isLoading={avatarUploading}
            isDisabled={(!isNew && !isEdit) || avatarUploading}
            onPress={() => {
              if (fileInputRef.current) {
                fileInputRef.current.click();
              }
            }}
          >
            Upload Avatar
          </Button>
        </div>

        {/* First Name */}
        <div className="">
          <TextInput
            name="firstName"
            control={control}
            isReadOnly={isReadOnly}
            label="First Name"
            placeholder="Enter first name"
          />
        </div>

        {/* Last Name */}
        <div className="">
          <TextInput
            name="lastName"
            control={control}
            isReadOnly={isReadOnly}
            label="Last Name"
            placeholder="Enter last name"
          />
        </div>

        {/* Email Address */}
        <div className="">
          <TextInput
            name="emailAddress"
            control={control}
            required
            type="email"
            isReadOnly={isReadOnly}
            label="Email Address"
            placeholder="Enter email address"
          />
        </div>

        {/* Phone Number */}
        <div className="">
          <TextInput
            name="phoneNumber"
            control={control}
            type="tel"
            isReadOnly={isReadOnly}
            label="Phone Number"
            placeholder="Enter phone number"
          />
        </div>

        {/* Weekly Hours */}
        <div className="">
          <TextInput
            name="weeklyHours"
            control={control}
            type="text"
            rules={{
              pattern: { value: /^[1-9]\d*$/, message: "Must be Integer" },
            }}
            isReadOnly={isReadOnly}
            label="Weekly Hours"
            placeholder="Enter weekly hours"
          />
        </div>

        {/* Rates */}
        <div className="">
          <TextInput
            name="rates"
            control={control}
            type="text"
            rules={{
              pattern: { value: /^[1-9]\d*$/, message: "Must be Integer" },
            }}
            isReadOnly={isReadOnly}
            label="Rates"
            placeholder="Enter rates"
          />
        </div>

        {/* Roles */}
        <div>
          <SelectInput
            control={control}
            name="roleIds"
            label="Roles"
            defaultSelectedKey={staff?.roles.map((role) => role.id.toString())}
            required
            options={
              roles?.map((role: RoleDTO) => ({
                key: role.id,
                label: role.name
                  .toLowerCase()
                  .split("_")
                  .map((word) => word[0].toUpperCase() + word.slice(1))
                  .join(" "),
              })) || []
            }
            multiple
            isDisable={isReadOnly}
            placeholder="Select roles"
          />
        </div>

        {/* Courses */}
        <div>
          <SelectInput
            control={control}
            name="courseIds"
            label="Specialization"
            defaultSelectedKey={staff?.courses.map((course) =>
              course.id.toString()
            )}
            options={
              courses?.map((course) => ({
                key: course.id,
                label: course.name,
              })) || []
            }
            multiple
            isDisable={isReadOnly}
            placeholder="Select courses"
          />
        </div>

        {/* Schedules */}
        <div>
          <SelectInput
            control={control}
            name="scheduleIds"
            label="Teaching Availability"
            defaultSelectedKey={staff?.schedules.map((schedule) =>
              schedule.id.toString()
            )}
            multiple
            isDisable={isReadOnly}
            placeholder="Select schedules"
            options={
              schedules?.map((schedule) => ({
                key: schedule.id,
                label: schedule.code,
              })) || []
            }
          />
        </div>
      </div>
    </form>
  );
};

export default Form;
