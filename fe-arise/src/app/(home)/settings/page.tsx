"use client";

import { FaLocationArrow } from "react-icons/fa";
import { GrSchedule } from "react-icons/gr";
import { MdDiscount, MdHolidayVillage } from "react-icons/md";
import { RiFormula } from "react-icons/ri";
import SettingCard from "./components/SettingCard";

const settings = [
  {
    title: "Nhân Viên",
    href: "/settings/staffs",
    icon: <MdDiscount />,
    description: "Quản lý nhân viên",
  },
  {
    title: "Chiết Khấu",
    href: "/settings/discounts",
    icon: <MdDiscount />,
    description:
      "Quản lý chính sách chiết khấu học phí và các chương trình khuyến mãi đặc biệt để tăng tính hợp lý và khả năng tiếp cận.",
  },
  {
    title: "Lịch Trình",
    href: "/settings/schedules",
    icon: <GrSchedule />,
    description:
      "Tổ chức lịch học, quản lý thời khóa biểu và phân bổ tài nguyên hiệu quả để đảm bảo hoạt động học tập suôn sẻ.",
  },
  {
    title: "Địa Điểm",
    href: "/settings/locations",
    icon: <FaLocationArrow />,
    description:
      "Thiết lập và quản lý các địa điểm campus, phòng học, và các không gian học tập vật lý hoặc ảo.",
  },
  {
    title: "Ngày Nghỉ",
    href: "/settings/holidays",
    icon: <MdHolidayVillage />,
    description:
      "Lên kế hoạch và quản lý các ngày nghỉ, kỳ nghỉ, và các sự kiện trong lịch học của trường.",
  },
  {
    title: "Công Thức",
    href: "/settings/formulas",
    icon: <RiFormula />,
    description:
      "Tạo và quản lý các công thức tính điểm, học phí và các chỉ số học thuật hoặc tài chính khác.",
  },
];

const page = () => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {settings.map((setting) => (
        <SettingCard
          key={setting.title}
          title={setting.title}
          href={setting.href}
          icon={setting.icon}
          description={setting.description}
        />
      ))}
    </div>
  );
};

export default page;
