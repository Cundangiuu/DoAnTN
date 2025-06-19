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
    description: "Manage staff members",
  },
  {
    title: "Discounts",
    href: "/settings/discounts",
    icon: <MdDiscount />,
    description:
      "Manage tuition discount policies and special promotion programs to enhance affordability and accessibility.",
  },
  {
    title: "Schedules",
    href: "/settings/schedules",
    icon: <GrSchedule />,
    description:
      "Organize class schedules, manage timetables, and efficiently allocate resources to ensure smooth learning operations.",
  },
  {
    title: "Locations",
    href: "/settings/locations",
    icon: <FaLocationArrow />,
    description:
      "Set up and manage campus locations, classrooms, and physical or virtual learning spaces.",
  },
  {
    title: "Holidays",
    href: "/settings/holidays",
    icon: <MdHolidayVillage />,
    description:
      "Plan and manage holidays, vacations, and events in the school's academic calendar.",
  },
  {
    title: "Formulas",
    href: "/settings/formulas",
    icon: <RiFormula />,
    description:
      "Create and manage formulas for calculating grades, tuition fees, and other academic or financial metrics.",
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