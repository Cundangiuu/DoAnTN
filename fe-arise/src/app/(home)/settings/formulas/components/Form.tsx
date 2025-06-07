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
        toast.error(`Failed to ${isNew ? "create" : "update"} formula`);
      } else {
        toast.success(`${isNew ? "Created" : "Updated"} formula successfully!`);

        router.push(`/settings/formulas/${response.data.id}`);
      }
    } catch (error) {
      console.error("Error submitting the form: ", error);
      toast.error(`Failed to ${isNew ? "create" : "update"} formulas`);
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
            objectName={"Formula"}
            afterDelete={() => router.push("/settings/formulas")}
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Name */}
        <TextInput
          name="name"
          control={control}
          required
          isReadOnly={isReadOnly}
          label="Name"
          placeholder="Enter name"
        />

        <SelectInputWithSearch
          control={control}
          name="courseIds"
          label="Applicable Courses"
          defaultSelectedKeys={formula?.courseIds.map((id) => id.toString())}
          options={
            courses?.map((course) => ({
              key: course.id,
              label: course.name,
            })) || []
          }
          isDisable={isReadOnly}
          placeholder="Select courses"
        />
      </div>

      <h2 className="mt-4 text-xl text-zinc-700">Midterm Grade Formula</h2>
      <div className="grid grid-cols-4 gap-4 mt-2">
        <TextInput
          required
          name="midtermListeningMaxScore"
          control={control}
          isReadOnly={isReadOnly}
          label="Listening Max Score"
          rules={{
            pattern: {
              value: /^\d+(\.\d+)?$/,
              message: "Please enter a valid integer or float",
            },
          }}
          placeholder="Listening Max Score"
        />
        <TextInput
          required
          name="midtermReadingMaxScore"
          control={control}
          label="Reading Max Score"
          placeholder="Reading Max Score"
          isReadOnly={isReadOnly}
          rules={{
            pattern: {
              value: /^\d+(\.\d+)?$/,
              message: "Please enter a valid integer or float",
            },
          }}
        />
        <TextInput
          required
          name="midtermWritingMaxScore"
          control={control}
          label="Writing Max Score"
          placeholder="Writing Max Score"
          isReadOnly={isReadOnly}
          rules={{
            pattern: {
              value: /^\d+(\.\d+)?$/,
              message: "Please enter a valid integer or float",
            },
          }}
        />
        <TextInput
          required
          name="midtermSpeakingMaxScore"
          control={control}
          label="Speaking Max Score"
          placeholder="Speaking Max Score"
          isReadOnly={isReadOnly}
          rules={{
            pattern: {
              value: /^\d+(\.\d+)?$/,
              message: "Please enter a valid integer or float",
            },
          }}
        />
        <TextArea
          required
          control={control}
          name="midtermPercentageFormula"
          label="Percentage Formula"
          placeholder="Percentage Formula"
          isReadOnly={isReadOnly}
        />
        <div className="col-span-2">
          <TextArea
            required
            control={control}
            name="midtermClassificationFormula"
            label="Classification Formula"
            placeholder="Classification Formula"
            isReadOnly={isReadOnly}
          />
        </div>
      </div>

      <h2 className="mt-4 text-xl text-zinc-700">Final Grade Formula</h2>
      <div className="grid grid-cols-4 gap-4 mt-2">
        <TextInput
          required
          name="finalListeningMaxScore"
          control={control}
          isReadOnly={isReadOnly}
          label="Listening Max Score"
          placeholder="Listening Max Score"
          rules={{
            pattern: {
              value: /^\d+(\.\d+)?$/,
              message: "Please enter a valid integer or float",
            },
          }}
        />
        <TextInput
          required
          name="finalReadingMaxScore"
          control={control}
          label="Reading Max Score"
          placeholder="Reading Max Score"
          isReadOnly={isReadOnly}
          rules={{
            pattern: {
              value: /^\d+(\.\d+)?$/,
              message: "Please enter a valid integer or float",
            },
          }}
        />
        <TextInput
          required
          name="finalWritingMaxScore"
          control={control}
          label="Writing Max Score"
          placeholder="Writing Max Score"
          isReadOnly={isReadOnly}
          rules={{
            pattern: {
              value: /^\d+(\.\d+)?$/,
              message: "Please enter a valid integer or float",
            },
          }}
        />
        <TextInput
          required
          name="finalSpeakingMaxScore"
          control={control}
          label="Speaking Max Score"
          placeholder="Speaking Max Score"
          isReadOnly={isReadOnly}
          rules={{
            pattern: {
              value: /^\d+(\.\d+)?$/,
              message: "Please enter a valid integer or float",
            },
          }}
        />
        <TextArea
          required
          control={control}
          name="finalPercentageFormula"
          label="Percentage Formula"
          placeholder="Percentage Formula"
          isReadOnly={isReadOnly}
        />
        <div className="col-span-2">
          <TextArea
            required
            control={control}
            name="finalClassificationFormula"
            label="Classification Formula"
            placeholder="Classification Formula"
            isReadOnly={isReadOnly}
          />
        </div>
      </div>

      <h2 className="mt-4 text-xl text-zinc-700">Course Result Formula</h2>
      <div className="grid grid-cols-4 gap-4 mt-2">
        <TextInput
          required
          control={control}
          name="midtermGradeWeight"
          label="Midterm Grade Weight"
          placeholder="Midterm Grade Weight"
          isReadOnly={isReadOnly}
          rules={{
            pattern: {
              value: /^\d+(\.\d+)?$/,
              message: "Please enter a valid integer or float",
            },
          }}
        />
        <TextInput
          required
          control={control}
          name="finalGradeWeight"
          label="Final Grade Weight"
          placeholder="Final Grade Weight"
          isReadOnly={isReadOnly}
          rules={{
            pattern: {
              value: /^\d+(\.\d+)?$/,
              message: "Please enter a valid integer or float",
            },
          }}
        />
        <TextInput
          required
          control={control}
          name="bonusGradeWeight"
          label="Bonus Grade Weight"
          placeholder="Bonus Grade Weight"
          isReadOnly={isReadOnly}
          rules={{
            pattern: {
              value: /^\d+(\.\d+)?$/,
              message: "Please enter a valid integer or float",
            },
          }}
        />
        <div className="col-span-3">
          <TextArea
            required
            control={control}
            name="classificationFormula"
            label="Classification Formula"
            placeholder="Classification Formula"
            isReadOnly={isReadOnly}
          />
        </div>
      </div>
    </form>
  );
};

export default Form;
