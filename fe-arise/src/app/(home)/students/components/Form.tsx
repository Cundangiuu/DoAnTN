"use client";

import { DeleteActionButton, ImageCropper } from "@/components";
import {
  DateSelect,
  EditButton,
  SelectInput,
  SubmitButton,
  TextArea,
  TextInput,
} from "@/components/molecules/form";
import { ModalContext } from "@/contexts";
import { NewOrEditContext } from "@/contexts/NewOrEditContext";
import { DiscountDTO, StudentDTO, StudentRequestDTO } from "@/dtos";
import { useMeaningfulContext } from "@/hooks";
import { DiscountService, StudentService } from "@/services";
import { Avatar, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaCameraRetro } from "react-icons/fa";
import { toast } from "sonner";

type Props = {
  student?: StudentDTO;
};

const Form: React.FC<Readonly<Props>> = ({ student }) => {
  const router = useRouter();
  const { handleSubmit, control, watch } = useForm<StudentRequestDTO>({
    defaultValues: {
      name: student?.name,
      nickname: student?.nickname,
      phoneNumber: student?.phoneNumber,
      emailAddress: student?.emailAddress,
      note: student?.note,
      discountId: student?.discount?.id,
    },
  });

  const { isNew, isEdit } = useMeaningfulContext(NewOrEditContext);
  const isReadOnly = student && !isEdit && !isNew;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showModal } = useMeaningfulContext(ModalContext);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [avatar, setAvatar] = useState<Blob>();
  const [discounts, setDiscounts] = useState<DiscountDTO[]>();

  // Hàm xử lý submit form
  const onSubmit: SubmitHandler<StudentRequestDTO> = async (studentData) => {
    setFormSubmitting(true);
    const formData = new FormData();

    // Chuẩn bị dữ liệu student gửi lên server
    const studentRequest = {
      name: studentData.name,
      nickname: studentData.nickname,
      dateOfBirth: (studentData.dateOfBirth as Date).toString(),
      emailAddress: studentData.emailAddress,
      phoneNumber: studentData.phoneNumber,
      address: studentData.address,
      note: studentData.note,
      discountId: studentData.discountId,
    };

    formData.append(
      "studentRequest",
      new Blob([JSON.stringify(studentRequest)], { type: "application/json" })
    );

    // Nếu có ảnh avatar, thêm vào formData
    if (avatar) {
      const fileName = `${Date.now()}.png`;
      formData.append("avatar", avatar, fileName);
    }

    try {
      const response = await (student
        ? StudentService.updateStudent(formData, student.id)
        : StudentService.createStudent(formData));
      if (!response.data) {
        toast.error(`Không thể ${isNew ? "tạo" : "cập nhật"} học sinh`);
      } else {
        toast.success(`${isNew ? "Tạo" : "Cập nhật"} học sinh thành công!`);
        router.push(`/students/${response.data.code}`);
      }
    } catch (error) {
      console.error("Lỗi khi gửi form: ", error);
      toast.error(`Không thể ${isNew ? "tạo" : "cập nhật"} học sinh`);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Hàm xử lý khi người dùng chọn ảnh avatar mới
  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const avatar = e.target.files?.[0];
    setAvatarUploading(true);
    if (avatar) {
      const maxFileSize = 10 * 1024 * 1024; // 10MB
      if (avatar.size > maxFileSize) {
        toast.error("Kích thước file vượt quá giới hạn 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const src = reader.result?.toString() || "";
        // Hiển thị modal crop ảnh
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

  // Lấy danh sách các loại giảm giá khi component được tạo
  useEffect(() => {
    const getDiscounts = async () => {
      const response = await DiscountService.getAllDiscounts();
      setDiscounts(response.data?.content);
    };

    getDiscounts();
  }, []);

  const dateOfBirth = watch("dateOfBirth");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-3 my-5 justify-end">
        {/* Nút chỉnh sửa hoặc gửi form */}
        {!isEdit && !isNew ? (
          <EditButton
            href={`/students/${(student as StudentDTO)?.code}/edit`}
          />
        ) : (
          <SubmitButton isLoading={formSubmitting} />
        )}
        {/* Nút xóa học sinh nếu có */}
        {student && (
          <DeleteActionButton
            id={student.id}
            action={StudentService.deleteStudent}
            objectName={"Student"}
            afterDelete={() => router.push("/students")}
          />
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* Avatar và nút upload ảnh */}
        <div className="row-span-3 flex flex-col justify-start gap-3 items-center">
          {avatar ? (
            <Avatar
              src={URL.createObjectURL(avatar)}
              className="h-[80px] w-[80px]"
            />
          ) : student?.avatarUrl ? (
            <Avatar
              src={`/api/images?filePath=${student.avatarUrl}`}
              className="h-[80px] w-[80px]"
            />
          ) : (
            <Avatar
              className="h-[80px] w-[80px]"
              name={student?.name ?? "avatar"}
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
            Tải ảnh đại diện
          </Button>
        </div>

        {/* Tên học sinh */}
        <div className="">
          <TextInput
            name="name"
            control={control}
            required
            isReadOnly={isReadOnly}
            label="Họ và tên"
            placeholder="Nhập họ và tên học sinh"
          />
        </div>

        {/* Biệt danh */}
        <div className="">
          <TextInput
            name="nickname"
            control={control}
            isReadOnly={isReadOnly}
            label="Biệt danh"
            placeholder="Nhập biệt danh"
          />
        </div>

        {/* Số điện thoại */}
        <div className="">
          <TextInput
            name="phoneNumber"
            type="tel"
            control={control}
            required
            rules={{
              pattern: {
                value:
                  /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/,
                message: "Số điện thoại không hợp lệ",
              },
            }}
            isReadOnly={isReadOnly}
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
          />
        </div>

        {/* Ngày sinh */}
        <div className="">
          <DateSelect
            name="dateOfBirth"
            required
            control={control}
            label="Ngày sinh"
            rules={{
              validate: () =>
                new Date(dateOfBirth) < new Date() ||
                "Ngày sinh không được lớn hơn ngày hiện tại",
            }}
            isReadOnly={isReadOnly}
            defaultValue={student?.dateOfBirth}
          />
        </div>

        {/* Email */}
        <div className="">
          <TextInput
            name="emailAddress"
            control={control}
            isReadOnly={isReadOnly}
            type="email"
            label="Email"
            placeholder="Nhập địa chỉ email"
          />
        </div>

        {/* Loại giảm giá */}
        <div className="">
          <SelectInput
            control={control}
            name="discountId"
            label="Loại giảm giá"
            defaultSelectedKey={
              student?.discount && [student?.discount?.id.toString()]
            }
            options={
              discounts?.map((discount) => ({
                key: discount.id,
                label: discount.type,
              })) || []
            }
            isDisable={isReadOnly}
            placeholder="Chọn loại giảm giá"
          />
        </div>

        {/* Ghi chú */}
        <div className="">
          <TextArea
            name="note"
            control={control}
            label="Ghi chú"
            placeholder="Ghi chú"
            isReadOnly={isReadOnly}
          />
        </div>
      </div>
    </form>
  );
};

export default Form;
