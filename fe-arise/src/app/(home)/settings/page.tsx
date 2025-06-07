"use client";

import { FaLocationArrow } from "react-icons/fa";
import { GrSchedule } from "react-icons/gr";
import { MdDiscount, MdHolidayVillage } from "react-icons/md";
import { RiFormula } from "react-icons/ri";
import SettingCard from "./components/SettingCard";

const settings = [
  {
    title: "Staff",
    href: "/settings/staffs",
    icon: <MdDiscount />,
    description: "Manage Staffs",
  },
  {
    title: "Discount",
    href: "/settings/discounts",
    icon: <MdDiscount />,
    description:
      "Manage discount policies for tuition fees and special promotions to enhance affordability and accessibility.",
  },
  {
    title: "Schedule",
    href: "/settings/schedules",
    icon: <GrSchedule />,
    description:
      "Organize class schedules, manage timetables, and allocate resources effectively for smooth academic operations.",
  },
  {
    title: "Location",
    href: "/settings/locations",
    icon: <FaLocationArrow />,
    description:
      "Set up and manage campus locations, classrooms, and other physical or virtual learning spaces.",
  },
  {
    title: "Holiday",
    href: "/settings/holidays",
    icon: <MdHolidayVillage />,
    description:
      "Plan and manage holidays, breaks, and academic calendar events for the institution.",
  },
  {
    title: "Formula",
    href: "/settings/formulas",
    icon: <RiFormula />,
    description:
      "Create and manage formulas for calculating grades, fees, and other academic or financial metrics.",
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
