"use client";

import { Button, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import Link from "next/link";
import { GrConfigure } from "react-icons/gr";

type Props = {
  title: string;
  href: string;
  icon: React.ReactNode;
  description: string;
};

const SettingCard: React.FC<Props> = ({ title, href, icon, description }) => {
  return (
    <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
        <div className="flex w-full justify-between">
          <div className="flex gap-2 items-center">
            {icon}
            <div className="flex flex-col">
              <p className="text-md">{title}</p>
            </div>
          </div>
          <Button size="sm" as={Link} href={href}>
            <GrConfigure />
          </Button>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>{description}</p>
      </CardBody>
      <Divider />
    </Card>
  );
};

export default SettingCard;
