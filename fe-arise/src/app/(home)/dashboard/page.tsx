import ContentHeader from "@/components/organisms/header/ContentHeader";
import { getTotalClass } from "@/services/ClassService";
import { getTotalStudent } from "@/services/StudentService";
import Card from "./component/card";

export default async function DashBoard() {
  const student = await getTotalStudent();
  const totalClass = await getTotalClass();

  return (
    <div className="w-full h-full flex flex-col p-3 bg-[#f0f4f8]">
      <ContentHeader title="Trang Chủ" />
      <div className="min-h-screen p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Thẻ Tổng Số Học Sinh */}
          <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition duration-300 border-l-4 border-[#2255a6] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[#2255a6] opacity-10"></div> {/* Thêm lớp phủ màu xanh */}
            <h2 className="text-lg font-semibold text-gray-700 mb-2 z-10 relative">
              Tổng Số Học Sinh
            </h2>
            <p className="text-3xl font-bold text-[#2255a6] mt-2 z-10 relative">
              {student?.data || 0}
            </p>
          </div>

          {/* Thẻ Số Lượng Lớp Học Đang Hoạt Động */}
          <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition duration-300 border-l-4 border-[#2255a6] relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-[#2255a6] opacity-10"></div> {/* Thêm lớp phủ màu xanh */}
            <h2 className="text-lg font-semibold text-gray-700 mb-2 z-10 relative">
              Lớp Học Đang Hoạt Động
            </h2>
            <p className="text-3xl font-bold text-[#2255a6] mt-2 z-10 relative">
              {totalClass?.data || 0}
            </p>
          </div>
        </div>

        {/* Các Thẻ Chức Năng */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            title={"Lớp Học"}
            description={
              "Khám phá sự đa dạng của các lớp học đang hoạt động, phù hợp với các cấp độ và sở thích khác nhau. Theo dõi các lớp học đang diễn ra và sắp tới được thiết kế để nâng cao khả năng học tập và tương tác."
            }
            url={"/classes"}
          />
          <Card
            title={"Khóa Học"}
            description={
              "Đi sâu vào bộ sưu tập các khóa học được tuyển chọn của chúng tôi, bao gồm các chủ đề và lĩnh vực đa dạng. Cho dù bạn là người mới bắt đầu hay chuyên gia, hãy tìm khóa học phù hợp để mở rộng kiến thức của bạn."
            }
            url={"/courses"}
          />
          <Card
            title={"Học Sinh"}
            description={
              "Khám phá những thông tin chi tiết về cộng đồng học sinh của chúng tôi, bao gồm số lượng đăng ký, sự tham gia và thành tích. Tìm hiểu cách học sinh của chúng tôi đang đạt được những bước tiến trong hành trình học tập của họ."
            }
            url={"/students"}
          />
        </div>
      </div>
    </div>
  );
}