"use client";

import { useEffect } from "react";
import { toast } from "sonner";

type Props = {
  error?: string;
};

export default function UtilsWrapper({ error }: Readonly<Props>) {
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}