"use client";

import { LocationDTO, ScheduleDTO } from "@/dtos";
import { createContext, useMemo, useState } from "react";

type FormContextProps = {
  invalidFields: string[];
  setInvalidFields: (invalidFields: string[]) => void;
  schedules?: ScheduleDTO[];
  locations?: LocationDTO[];
};

export const FormContext = createContext<FormContextProps | undefined>(
  undefined
);

export default function FormContextProvider({
  children,
  schedules,
  locations,
}: Readonly<{
  children: React.ReactNode;
  schedules?: ScheduleDTO[];
  locations?: LocationDTO[];
}>) {
  const [invalidFields, setInvalidFields] = useState<string[]>([]);

  const initValue = useMemo(
    () => ({
      invalidFields,
      setInvalidFields,
      schedules,
      locations,
    }),
    [invalidFields, schedules, locations]
  );

  return (
    <FormContext.Provider value={initValue}>
      {children}
    </FormContext.Provider>
  );
}
