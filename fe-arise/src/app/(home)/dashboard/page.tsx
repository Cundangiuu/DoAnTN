import ContentHeader from "@/components/organisms/header/ContentHeader";
import { getTotalClass } from "@/services/ClassService";
import { getTotalStudent } from "@/services/StudentService";
import Card from "./component/card";

export default async function DashBoard() {
  const student = await getTotalStudent();
  const totalClass = await getTotalClass();

  return (
    <div className="w-full h-full flex flex-col p-3 bg-[#f0f4f8]">
      <ContentHeader title="Dashboard" />
      <div className="min-h-screen p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Total Students Card */}
          <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition duration-300 border-l-4 border-[#2255a6] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[#2255a6] opacity-10"></div> {/* Add blue overlay */}
            <h2 className="text-lg font-semibold text-gray-700 mb-2 z-10 relative">
              Total Students
            </h2>
            <p className="text-3xl font-bold text-[#2255a6] mt-2 z-10 relative">
              {student?.data || 0}
            </p>
          </div>

          {/* Active Classes Card */}
          <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition duration-300 border-l-4 border-[#2255a6] relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-[#2255a6] opacity-10"></div> {/* Add blue overlay */}
            <h2 className="text-lg font-semibold text-gray-700 mb-2 z-10 relative">
              Active Classes
            </h2>
            <p className="text-3xl font-bold text-[#2255a6] mt-2 z-10 relative">
              {totalClass?.data || 0}
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            title={"Classes"}
            description={
              "Explore our diverse range of active classes, tailored to various levels and interests. Track ongoing and upcoming classes designed to enhance learning and engagement."
            }
            url={"/classes"}
          />
          <Card
            title={"Courses"}
            description={
              "Delve into our curated collection of courses, covering diverse subjects and disciplines. Whether you're a beginner or an expert, find the right course to expand your knowledge."
            }
            url={"/courses"}
          />
          <Card
            title={"Students"}
            description={
              "Discover insights into our student community, including enrollment numbers, engagement, and achievements. Learn how our students are making strides in their learning journeys."
            }
            url={"/students"}
          />
        </div>
      </div>
    </div>
  );
}