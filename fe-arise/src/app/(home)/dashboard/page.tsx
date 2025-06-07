import ContentHeader from "@/components/organisms/header/ContentHeader";
import { getTotalClass } from "@/services/ClassService";
import { getTotalStudent } from "@/services/StudentService";
import Card from "./component/card";

export default async function DashBoard() {
  const student = await getTotalStudent();
  const totalClass = await getTotalClass();

  return (
    <div className="w-full h-full flex flex-col p-3">
      <ContentHeader title="Home"></ContentHeader>
      <div className="min-h-screen p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-500">Students</h2>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {student.data}
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-500">
              Active Classes
            </h2>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {totalClass.data}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            title={"Classes"}
            description={
              "Explore the wide variety of active classes available, tailored to different levels and interests. Keep track of ongoing and upcoming classes designed to enhance learning and engagement."
            }
            url={"/classes"}
          />
          <Card
            title={"Courses"}
            description={
              "Dive into our curated collection of courses spanning diverse topics and disciplines. Whether you're a beginner or an expert, find the right course to expand your knowledge."
            }
            url={"/courses"}
          />
          <Card
            title={"Students"}
            description={
              "Discover detailed insights about our student community, including enrollment numbers, participation, and achievements. Learn how our students are making strides in their educational journey."
            }
            url={"/students"}
          />
        </div>
      </div>
    </div>
  );
}
