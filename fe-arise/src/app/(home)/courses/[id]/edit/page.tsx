import { getCourseById } from "@/services/CourseService";
import { notFound } from "next/navigation";
import CourseForm from "../components/CourseForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditCourse({ params }: Readonly<Props>) {
  const { id } = await params; 
  const response = await getCourseById(id);

  if (!response.data) {
    notFound();
  }

  return <CourseForm defaultCourse={response.data} operation="update" />;
}
