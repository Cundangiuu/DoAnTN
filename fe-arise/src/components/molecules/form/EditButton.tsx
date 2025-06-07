"use client";

import { SessionContext } from "@/contexts";
import { useMeaningfulContext } from "@/hooks";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useState } from "react";
import { FaPen } from "react-icons/fa";

const EditButton = ({
  href,
  onPress,
  isIconOnly,
  disabled,
}: {
  href?: string;
  onPress?: () => void;
  isIconOnly?: boolean;
  disabled?: boolean;
}) => {
  const { isTeacher } = useMeaningfulContext(SessionContext);
  const [isLoading, setIsLoading] = useState(false);

  if (href) {
    return (
      <Button
        as={Link}
        isDisabled={disabled || isTeacher}
        isIconOnly={isIconOnly}
        startContent={<FaPen />}
        href={href}
      >
        {!isIconOnly && "Edit"}
      </Button>
    );
  }

  if (onPress) {
    return (
      <Button
        isDisabled={disabled || isTeacher}
        isIconOnly={isIconOnly}
        startContent={<FaPen />}
        isLoading={isLoading}
        onPress={() => {
          setIsLoading(true);
          onPress();
          setIsLoading(false);
        }}
      >
        {!isIconOnly && "Edit"}
      </Button>
    );
  }

  return null;
};

export default EditButton;
