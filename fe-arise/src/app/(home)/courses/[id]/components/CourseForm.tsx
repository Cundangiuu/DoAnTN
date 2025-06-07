"use client";

import FormContextProvider from "@/app/(home)/classes/(utilities)/new/component/Form/FormContext";
import { SubmitButton } from "@/components/molecules/form";
import { CourseLevelConstants } from "@/constants/course";
import { CourseDTO, CourseRequest } from "@/dtos";
import { addCourse, updateCourse } from "@/services/CourseService";
import {
  Input,
  Select,
  SelectItem,
  Tab,
  Tabs,
  Textarea,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import EnrollmentTable from "./EnrollmentTable";
import OutlineTable from "./OutlineTable";

type Props = {
  title?: string;
  defaultCourse?: CourseDTO;
  isDisabled?: boolean;
  isReadonly?: boolean;
  operation?: "create" | "update";
};

export default function CourseForm({
  defaultCourse,
  isDisabled,
  isReadonly,
  operation,
  title,
}: Readonly<Props>) {
  const router = useRouter();
  const onSubmit = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const numberHour = Number(formData.get("numberHour"));
    const tuitionRate = Number(formData.get("tuitionRate"));
    const courseLevel = formData.get(
      "courseLevelConstants"
    ) as CourseLevelConstants;
    const description = formData.get("description") as string;

    const courseRequest: CourseRequest = {
      name: name,
      numberHour: numberHour,
      tuitionRate: tuitionRate,
      courseLevelConstants: courseLevel,
      description: description,
    };
    let response;
    if (operation === "update") {
      if (!defaultCourse?.code) {
        toast.error("Course not found");
        return;
      }
      response = await updateCourse(courseRequest, defaultCourse.code);
    } else {
      response = await addCourse(courseRequest);
    }
    if (!response.data) {
      toast.error(`Failed to ${operation} course`);
      return;
    }
    toast.success(`Course ${operation}d`);
    router.push(`/courses/${response.data.code}`);
  };

  return (
    <>
      <FormContextProvider>
        <form action={onSubmit}>
          <div className="w-full flex gap-3 justify-between">
            <h1 className="font-bold uppercase">{title}</h1>
            {!(isDisabled || isReadonly) && <SubmitButton />}
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-4 gap-x-10 gap-y-10 mb-5 mt-5">
            <Input
              isReadOnly={isReadonly}
              isDisabled={isDisabled}
              name="name"
              isRequired
              label="Name"
              placeholder="Enter course name"
              labelPlacement="outside"
              defaultValue={defaultCourse?.name}
            />
            <Input
              isReadOnly={isReadonly}
              isDisabled={isDisabled}
              label="Number of Hours"
              name="numberHour"
              labelPlacement="outside"
              placeholder="Number of Hours"
              type="number"
              defaultValue={defaultCourse?.numberHour.toString()}
            />
            <Input
              isReadOnly={isReadonly}
              isDisabled={isDisabled}
              label="Tuition"
              name="tuitionRate"
              labelPlacement="outside"
              placeholder="Enter tuition"
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">đ</span>
                </div>
              }
              defaultValue={defaultCourse?.tuitionRate.toString()}
              type="number"
            />
            <Select
              isDisabled={isDisabled}
              name="courseLevelConstants"
              label="Level"
              placeholder="Select level"
              className="w-full"
              labelPlacement="outside"
              isRequired
              defaultSelectedKeys={
                defaultCourse?.courseLevel
                  ? [defaultCourse.courseLevel]
                  : [CourseLevelConstants.YOUNG_LEARNERS]
              }
            >
              {Object.values(CourseLevelConstants).map((value) => (
                <SelectItem value={value} key={value}>
                  {value}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div>
            <Textarea
              name="description"
              label="Description"
              placeholder="Enter description"
              isReadOnly={isReadonly}
              isDisabled={isDisabled}
              defaultValue={defaultCourse?.description}
            />
          </div>
        </form>
      </FormContextProvider>
      <div className="w-full flex gap-3 flex-col mt-8 bg-slate-50 p-4 rounded-md">
        <Tabs aria-label="Infos" color="primary">
          <Tab key={"outline"} title={"Outline"}>
            <OutlineTable
              isNew={operation == "create" ? true : false}
              isReadonly={isReadonly}
              defaultLessons={defaultCourse?.lessons}
              courseCode={defaultCourse?.code}
            />
          </Tab>
          <Tab key={"pre-enrollment"} title={"Pre-Enrollment"}>
            <EnrollmentTable
              isNew={operation == "create" ? true : false}
              courseId={defaultCourse?.id}
              isReadonly={isReadonly}
              defaultEnrollments={defaultCourse?.enrollments}
              courseCode={defaultCourse?.code}
            />
          </Tab>
        </Tabs>
      </div>
    </>
  );
}
