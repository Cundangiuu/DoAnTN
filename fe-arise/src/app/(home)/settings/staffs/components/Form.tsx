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

  // Lấy dữ liệu cho dropdown
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

  // Cấu hình biểu mẫu
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

  // Xử lý khi submit biểu mẫu
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
        toast.error(`Không thể ${staff ? "cập nhật" : "tạo"} nhân viên`);
      } else {
        toast.success(`Nhân viên đã được ${staff ? "cập nhật" : "tạo"} thành công!`);
        router.push(`/settings/staffs/${response.data.id}`);
      }
    } catch (error) {
      console.error("Lỗi khi gửi biểu mẫu: ", error);
      toast.error(`Không thể ${staff ? "cập nhật" : "tạo"} nhân viên`);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Xử lý tải lên avatar
  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const avatar = e.target.files?.[0];
    setAvatarUploading(true);
    if (avatar) {
      const maxFileSize = 10 * 1024 * 1024;
      if (avatar.size > maxFileSize) {
        toast.error("Kích thước file vượt quá giới hạn 5MB.");
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
      {/* Nút hành động */}
      <div className="flex gap-3 my-5 justify-end">
        {!isEdit && !isNew ? (
          <EditButton href={`/settings/staffs/${(staff as StaffDTO)?.id}/edit`} />
        ) : (
          <SubmitButton isLoading={formSubmitting} />
        )}
        {staff && (
          <DeleteActionButton
            id={staff.id}
            action={StaffService.deleteStaff}
            objectName="Nhân viên"
            afterDelete={() => router.push("/settings/staffs")}
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Khu vực ảnh đại diện */}
        <div className="row-span-3 flex flex-col justify-start gap-3 items-center">
          {avatar ? (
            <Avatar src={URL.createObjectURL(avatar)} className="h-[80px] w-[80px]" />
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
            onPress={() => fileInputRef.current?.click()}
          >
            Tải ảnh đại diện
          </Button>
        </div>

        {/* Họ */}
        <TextInput
          name="firstName"
          control={control}
          isReadOnly={isReadOnly}
          label="Họ"
          placeholder="Nhập họ"
        />

        {/* Tên */}
        <TextInput
          name="lastName"
          control={control}
          isReadOnly={isReadOnly}
          label="Tên"
          placeholder="Nhập tên"
        />

        {/* Email */}
        <TextInput
          name="emailAddress"
          control={control}
          required
          type="email"
          isReadOnly={isReadOnly}
          label="Địa chỉ Email"
          placeholder="Nhập email"
        />

        {/* Số điện thoại */}
        <TextInput
          name="phoneNumber"
          control={control}
          type="tel"
          isReadOnly={isReadOnly}
          label="Số điện thoại"
          placeholder="Nhập số điện thoại"
        />

        {/* Giờ dạy trong tuần */}
        <TextInput
          name="weeklyHours"
          control={control}
          type="text"
          rules={{ pattern: { value: /^[1-9]\d*$/, message: "Phải là số nguyên" } }}
          isReadOnly={isReadOnly}
          label="Số giờ dạy / tuần"
          placeholder="Nhập số giờ"
        />

        {/* Mức lương */}
        <TextInput
          name="rates"
          control={control}
          type="text"
          rules={{ pattern: { value: /^[1-9]\d*$/, message: "Phải là số nguyên" } }}
          isReadOnly={isReadOnly}
          label="Mức lương"
          placeholder="Nhập mức lương"
        />

        {/* Vai trò */}
        <SelectInput
          control={control}
          name="roleIds"
          label="Vai trò"
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
          placeholder="Chọn vai trò"
        />

        {/* Môn dạy */}
        <SelectInput
          control={control}
          name="courseIds"
          label="Chuyên môn"
          defaultSelectedKey={staff?.courses.map((course) => course.id.toString())}
          options={
            courses?.map((course) => ({
              key: course.id,
              label: course.name,
            })) || []
          }
          multiple
          isDisable={isReadOnly}
          placeholder="Chọn môn chuyên môn"
        />

        {/* Lịch dạy */}
        <SelectInput
          control={control}
          name="scheduleIds"
          label="Lịch dạy"
          defaultSelectedKey={staff?.schedules.map((schedule) =>
            schedule.id.toString()
          )}
          multiple
          isDisable={isReadOnly}
          placeholder="Chọn lịch dạy"
          options={
            schedules?.map((schedule) => ({
              key: schedule.id,
              label: schedule.code,
            })) || []
          }
        />
      </div>
    </form>
  );
};

export default Form;
