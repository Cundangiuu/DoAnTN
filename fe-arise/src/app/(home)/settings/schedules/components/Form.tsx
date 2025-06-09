"use client";

import {
  EditButton,
  SelectInput,
  SubmitButton,
  TextArea,
  TimeSelect,
} from "@/components/molecules/form";
import { DayOfWeek } from "@/constants/dayOfWeek";
import { NewOrEditContext } from "@/contexts/NewOrEditContext";
import { ScheduleDTO, ScheduleRequestDTO } from "@/dtos";
import { useMeaningfulContext } from "@/hooks";
import { ScheduleService } from "@/services";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  schedule?: ScheduleDTO;
};

const dayOfWeekOptions = Object.entries(DayOfWeek).map((entry) => ({
  key: entry[1],
  label: entry[0],
}));

const Form: React.FC<Props> = ({ schedule }) => {
  const router = useRouter();
  const [formSubmitting, setFormSubmitting] = useState(false);
  const { isNew, isEdit } = useMeaningfulContext(NewOrEditContext);
  const { handleSubmit, control, watch } = useForm<ScheduleRequestDTO>({
    defaultValues: {
      description: schedule?.description,
      dayOfWeek: schedule?.dayOfWeek,
    },
  });

  const startTime = watch("startTime");
  const endTime = watch("endTime");

  const onSubmit: SubmitHandler<ScheduleRequestDTO> = async (scheduleData) => {
    setFormSubmitting(true);
    scheduleData = {
      ...scheduleData,
      startTime: new Date(`2025-01-01T${scheduleData.startTime.toString()}`),
      endTime: new Date(`2025-01-01T${scheduleData.endTime.toString()}`),
    };

    try {
      const response = await (schedule
        ? ScheduleService.updateSchedule(scheduleData, schedule.id)
        : ScheduleService.createSchedule(scheduleData));
      if (!response.data) {
        toast.error(`Không thể ${isNew ? "tạo" : "cập nhật"} lịch trình`);
      } else {
        toast.success(
          `${isNew ? "Tạo" : "Cập nhật"} lịch trình thành công!`
        );
        router.push(`/settings/schedules/${response.data.id}`);
      }
    } catch (error) {
      console.error("Lỗi khi gửi biểu mẫu: ", error);
      toast.error(`Không thể ${isNew ? "tạo" : "cập nhật"} lịch trình`);
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-3 my-5 justify-end">
        {!isEdit && !isNew ? (
          <EditButton
            href={`/settings/schedules/${(schedule as ScheduleDTO)?.id}/edit`}
          />
        ) : (
          <SubmitButton isLoading={formSubmitting} />
        )}
        {/* {schedule && (
          <DeleteActionButton
            id={schedule.id}
            action={ScheduleService.deleteSchedule}
            objectName={"Lịch trình"}
            afterDelete={() => router.push("/settings/schedules")}
          />
        )} */}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <SelectInput
            control={control}
            defaultSelectedKey={schedule && [schedule.dayOfWeek]}
            name="dayOfWeek"
            label="Ngày trong tuần"
            required
            placeholder="Chọn ngày trong tuần"
            options={dayOfWeekOptions}
            isDisable={schedule && !isEdit && !isNew}
          />
        </div>
        <div>
          <TimeSelect
            control={control}
            defaultValue={schedule?.startTime}
            rules={{
              validate: {
                notGreater: () => {
                  if (startTime >= endTime)
                    return "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc";
                },
              },
            }}
            isDisable={schedule && !isEdit && !isNew}
            name="startTime"
            label="Thời gian bắt đầu"
            required
          />
        </div>
        <div>
          <TimeSelect
            control={control}
            defaultValue={schedule?.endTime}
            rules={{
              validate: {
                notSmaller: () => {
                  if (startTime >= endTime)
                    return "Thời gian kết thúc phải lớn hơn thời gian bắt đầu";
                },
              },
            }}
            isDisable={schedule && !isEdit && !isNew}
            name="endTime"
            label="Thời gian kết thúc"
            required
          />
        </div>
        <div>
          <TextArea
            control={control}
            name="description"
            label="Mô tả"
            placeholder="Nhập mô tả"
            isReadOnly={schedule && !isEdit && !isNew}
          />
        </div>
      </div>
    </form>
  );
};

export default Form;
