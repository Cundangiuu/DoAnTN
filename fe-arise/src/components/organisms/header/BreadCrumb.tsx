"use client";

import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import { usePathname } from "next/navigation";

const BreadCrumb = () => {
  const path = usePathname().split("/");

  const capitalize = (str: string) => {
    if (!str) return "";
    return str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Breadcrumbs underline="hover" variant="solid" size="lg">
      {path.map(
        (item, index) =>
          item && (
            <BreadcrumbItem
              href={path.slice(0, index + 1).join("/")}
              key={item}
            >
              {capitalize(item)}
            </BreadcrumbItem>
          )
      )}
    </Breadcrumbs>
  );
};

export default BreadCrumb;
