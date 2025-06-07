"use client";

import { SessionContext } from "@/contexts";
import { useMeaningfulContext } from "@/hooks";
import { Button } from "@nextui-org/react";

const SubmitButton = ({ isLoading }: { isLoading?: boolean }) => {
  const { isTeacher } = useMeaningfulContext(SessionContext);

  return (
    <Button
      type="submit"
      isLoading={isLoading || false}
      disabled={isTeacher}
      color="primary"
    >
      Save
    </Button>
  );
};

export default SubmitButton;
