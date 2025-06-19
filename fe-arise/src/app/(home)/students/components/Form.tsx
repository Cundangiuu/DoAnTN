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

  // Handler for form submission
  const onSubmit: SubmitHandler<StudentRequestDTO> = async (studentData) => {
    setFormSubmitting(true);
    const formData = new FormData();

    // Prepare student data to be sent to the server
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

    // If there's an avatar image, append it to formData
    if (avatar) {
      const fileName = `${Date.now()}.png`;
      formData.append("avatar", avatar, fileName);
    }

    try {
      const response = await (student
        ? StudentService.updateStudent(formData, student.id)
        : StudentService.createStudent(formData));
      if (!response.data) {
        toast.error(`Could not ${isNew ? "create" : "update"} student`);
      } else {
        toast.success(`${isNew ? "Create" : "Update"} student successfully!`);
        router.push(`/students/${response.data.code}`);
      }
    } catch (error) {
      console.error("Error submitting form: ", error);
      toast.error(`Could not ${isNew ? "create" : "update"} student`);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handler for when the user selects a new avatar image
  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const avatar = e.target.files?.[0];
    setAvatarUploading(true);
    if (avatar) {
      const maxFileSize = 10 * 1024 * 1024; // 10MB
      if (avatar.size > maxFileSize) {
        toast.error("File size exceeds the 5MB limit.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const src = reader.result?.toString() || "";
        // Show the image cropper modal
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

  // Get the list of discount types when the component is created
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
        {/* Edit or Submit button */}
        {!isEdit && !isNew ? (
          <EditButton
            href={`/students/${(student as StudentDTO)?.code}/edit`}
          />
        ) : (
          <SubmitButton isLoading={formSubmitting} />
        )}
        {/* Delete student button if available */}
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
        {/* Avatar and upload button */}
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
            Upload Avatar
          </Button>
        </div>

        {/* Student Name */}
        <div className="">
          <TextInput
            name="name"
            control={control}
            required
            isReadOnly={isReadOnly}
            label="Full Name"
            placeholder="Enter student's full name"
          />
        </div>

        {/* Nickname */}
        <div className="">
          <TextInput
            name="nickname"
            control={control}
            isReadOnly={isReadOnly}
            label="Nickname"
            placeholder="Enter nickname"
          />
        </div>

        {/* Phone Number */}
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
                message: "Invalid phone number",
              },
            }}
            isReadOnly={isReadOnly}
            label="Phone Number"
            placeholder="Enter phone number"
          />
        </div>

        {/* Date of Birth */}
        <div className="">
          <DateSelect
            name="dateOfBirth"
            required
            control={control}
            label="Date of Birth"
            rules={{
              validate: () =>
                new Date(dateOfBirth) < new Date() ||
                "Date of birth cannot be greater than the current date",
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
            placeholder="Enter email address"
          />
        </div>

        {/* Discount Type */}
        <div className="">
          <SelectInput
            control={control}
            name="discountId"
            label="Discount Type"
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
            placeholder="Select discount type"
          />
        </div>

        {/* Note */}
        <div className="">
          <TextArea
            name="note"
            control={control}
            label="Note"
            placeholder="Note"
            isReadOnly={isReadOnly}
          />
        </div>
      </div>
    </form>
  );
};

export default Form;