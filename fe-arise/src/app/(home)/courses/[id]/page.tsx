import { EditButton } from "@/components/molecules/form";
import { notFound } from "next/navigation";
import { getCourseById } from "@/services/CourseService";
import CourseForm from "./components/CourseForm";

export default async function CourseDetail({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const response = await getCourseById(id);

  if (!response.data) {
    notFound();
  }

  return (
    <>
      <div className="w-full mt-8 flex gap-3 justify-between">
        <h1 className="font-bold uppercase">{response.data.code}</h1>
        <EditButton href={`/courses/${id}/edit`} />
      </div>
      <CourseForm isReadonly isDisabled defaultCourse={response.data}/>
    </>
  );
}
