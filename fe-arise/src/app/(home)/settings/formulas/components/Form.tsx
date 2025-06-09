"use client";

import { DeleteActionButton } from "@/components";
import {
  EditButton,
  SelectInputWithSearch,
  SubmitButton,
  TextArea,
  TextInput,
} from "@/components/molecules/form";
import { NewOrEditContext } from "@/contexts/NewOrEditContext";
import { CourseDTO } from "@/dtos";
import { FormulaDTO } from "@/dtos/formula/FormulaDTO";
import { FormulaRequestDTO } from "@/dtos/formula/FormulaRequestDTO";
import { useMeaningfulContext } from "@/hooks";
import { CourseService, FormulaService } from "@/services";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  formula?: FormulaDTO;
};

const Form: React.FC<Props> = ({ formula }) => {
  const router = useRouter();

  const { handleSubmit, control } = useForm<FormulaRequestDTO>({
    defaultValues: formula as FormulaRequestDTO,
  });
  const [courses, setCourses] = useState<CourseDTO[]>();
  const [formSubmitting, setFormSubmitting] = useState(false);
  const { isNew, isEdit } = useMeaningfulContext(NewOrEditContext);
  const isReadOnly = formula && !isEdit && !isNew;

  useEffect(() => {
    const fetchData = async () => {
      const coursesResponse = await CourseService.getFullCourse();

      setCourses(coursesResponse.data);
    };

    fetchData();
  }, []);

  const onSubmit: SubmitHandler<FormulaRequestDTO> = async (formulaRequest) => {
    try {
      setFormSubmitting(true);
      const response = await (formula
        ? FormulaService.updateFormula(formulaRequest, formula.id)
        : FormulaService.createFormula(formulaRequest));
      if (!response.data) {
        toast.error(`Không thể ${isNew ? "tạo" : "cập nhật"} công thức`);
      } else {
        toast.success(`${isNew ? "Đã tạo" : "Đã cập nhật"} công thức thành công!`);

        router.push(`/settings/formulas/${response.data.id}`);
      }
    } catch (error) {
      console.error("Lỗi khi gửi biểu mẫu: ", error);
      toast.error(`Không thể ${isNew ? "tạo" : "cập nhật"} công thức`);
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-3 my-5 justify-end">
        {!isEdit && !isNew ? (
          <EditButton
            href={`/settings/formulas/${(formula as FormulaDTO)?.id}/edit`}
          />
        ) : (
          <SubmitButton isLoading={formSubmitting} />
        )}
        {formula && (
          <DeleteActionButton
            id={formula.id}
            action={FormulaService.deleteFormula}
            objectName={"Công thức"}
            afterDelete={() => router.push("/settings/formulas")}
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Tên */}
        <TextInput
          name="name"
          control={control}
          required
          isReadOnly={isReadOnly}
          label="Tên"
          placeholder="Nhập tên"
        />

        <SelectInputWithSearch
          control={control}
          name="courseIds"
          label="Khóa học áp dụng"
          defaultSelectedKeys={formula?.courseIds.map((id) => id.toString())}
          options={
            courses?.map((course) => ({
              key: course.id,
              label: course.name,
            })) || []
          }
          isDisable={isReadOnly}
          placeholder="Chọn khóa học"
        />
      </div>

      <h2 className="mt-4 text-xl text-zinc-700">Công thức điểm giữa kỳ</h2>
      <div className="grid grid-cols-4 gap-4 mt-2">
        <TextInput
          required
          name="midtermListeningMaxScore"
          control={control}
          isReadOnly={isReadOnly}
          label="Điểm tối đa Nghe"
          placeholder="Điểm tối đa Nghe"
          rules={{
            pattern: {
              value: /^\d+(\.\d+)?$/,
              message: "Vui lòng nhập số nguyên hoặc số thập phân hợp lệ",
            },
          }}
        />
        <TextInput
          required
          name="midtermReadingMaxScore"
          control={control}
          label="Điểm tối đa Đọc"
          placeholder="Điểm tối đa Đọc"
          isReadOnly={isReadOnly}
          rules={{
            pattern: {
              value: /^\d+(\.\d+)?$/,
              message: "Vui lòng nhập số nguyên hoặc số thập phân hợp lệ",
            },
          }}
        />
        <TextInput
          required
          name="midtermWritingMaxScore"
          control={control}
          label="Điểm tối đa Viết"
          placeholder="Điểm tối đa Viết"
          isReadOnly={isReadOnly}
          rules={{
            pattern: {
              value: /^\d+(\.\d+)?$/,
              message: "Vui lòng nhập số nguyên hoặc số thập phân hợp lệ",
            },
          }}
        />
        <TextInput
          required
          name="midtermSpeakingMaxScore"
          control={control}
          label="Điểm tối đa Nói"
          placeholder="Điểm tối đa Nói"
          isReadOnly={isReadOnly}
          rules={{
            pattern: {
              value: /^\d+(\.\d+)?$/,
              message: "Vui lòng nhập số nguyên hoặc số thập phân hợp lệ",
            },
          }}
        />
        <TextArea
          required
          control={control}
          name="midtermPercentageFormula"
          label="Công thức tỷ lệ phần trăm"
          placeholder="Công thức tỷ lệ phần trăm"
          isReadOnly={isReadOnly}
        />
        <div className="col-span-2">
          <TextArea
            required
            control={control}
            name="midtermClassificationFormula"
            label="Công thức phân loại"
            placeholder="Công thức phân loại"
            isReadOnly={isReadOnly}
          />
        </div>
      </div>

      <h2 className="mt-4 text-xl text-zinc-700">Công thức điểm cuối kỳ</h2>
      <div className="grid grid-cols-4 gap-4 mt-2">
        <TextInput
          required
          name="finalListeningMaxScore"
          control={control}
          isReadOnly={isReadOnly}
          label="Điểm tối đa Nghe"
          placeholder="Điểm tối đa Nghe"
          rules={{
            pattern: {
              value: /^\d+(\.\d+)?$/,
              message: "Vui lòng nhập số nguyên hoặc số thập phân hợp lệ",
            },
          }}
        />
        <TextInput
          required
          name="finalReadingMaxScore"
          control={control}
          label="Điểm tối đa Đọc"
          placeholder="Điểm tối đa Đọc"
          isReadOnly={isReadOnly}
          rules={{
            pattern: {
              value: /^\d+(\.\d+)?$/,
              message: "Vui lòng nhập số nguyên hoặc số thập phân hợp lệ",
            },
          }}
        />
        <TextInput
          required
          name="finalWritingMaxScore"
          control={control}
          label="Điểm tối đa Viết"
          placeholder="Điểm tối đa Viết"
          isReadOnly={isReadOnly}
          rules={{
            pattern: {
              value: /^\d+(\.\d+)?$/,
              message: "Vui lòng nhập số nguyên hoặc số thập phân hợp lệ",
            },
          }}
        />
        <TextInput
          required
          name="finalSpeakingMaxScore"
          control={control}
          label="Điểm tối đa Nói"
          placeholder="Điểm tối đa Nói"
          isReadOnly={isReadOnly}
          rules={{
            pattern: {
              value: /^\d+(\.\d+)?$/,
              message: "Vui lòng nhập số nguyên hoặc số thập phân hợp lệ",
            },
          }}
        />
        <TextArea
          required
          control={control}
          name="finalPercentageFormula"
          label="Công thức tỷ lệ phần trăm"
          placeholder="Công thức tỷ lệ phần trăm"
          isReadOnly={isReadOnly}
        />
        <div className="col-span-2">
          <TextArea
            required
            control={control}
            name="finalClassificationFormula"
            label="Công thức phân loại"
            placeholder="Công thức phân loại"
            isReadOnly={isReadOnly}
          />
        </div>
      </div>

      <h2 className="mt-4 text-xl text-zinc-700">Công thức kết quả khóa học</h2>
      <div className="grid grid-cols-4 gap-4 mt-2">
        <TextInput
          required
          control={control}
          name="midtermGradeWeight"
          label="Trọng số điểm giữa kỳ"
          placeholder="Trọng số điểm giữa kỳ"
          isReadOnly={isReadOnly}
          rules={{
            pattern: {
              value: /^\d+(\.\d+)?$/,
              message: "Vui lòng nhập số nguyên hoặc số thập phân hợp lệ",
            },
          }}
        />
        <TextInput
          required
          control={control}
          name="finalGradeWeight"
          label="Trọng số điểm cuối kỳ"
          placeholder="Trọng số điểm cuối kỳ"
          isReadOnly={isReadOnly}
          rules={{
            pattern: {
              value: /^\d+(\.\d+)?$/,
              message: "Vui lòng nhập số nguyên hoặc số thập phân hợp lệ",
            },
          }}
        />
        <TextInput
          required
          control={control}
          name="bonusGradeWeight"
          label="Trọng số điểm thưởng"
          placeholder="Trọng số điểm thưởng"
          isReadOnly={isReadOnly}
          rules={{
            pattern: {
              value: /^\d+(\.\d+)?$/,
              message: "Vui lòng nhập số nguyên hoặc số thập phân hợp lệ",
            },
          }}
        />
        <div className="col-span-3">
          <TextArea
            required
            control={control}
            name="classificationFormula"
            label="Công thức phân loại"
            placeholder="Công thức phân loại"
            isReadOnly={isReadOnly}
          />
        </div>
      </div>
    </form>
  );
};

export default Form;
