"use client";

import { IOStringToCalendarDate } from "@/utils/DateUtils";
import { DateInput } from "@nextui-org/react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  required?: boolean;
  label?: string;
  isDisable?: boolean;
  isReadOnly?: boolean;
  rules?: object;
  defaultValue?: PathValue<T, Path<T>>;
};

const DateSelect = <T extends FieldValues>({
  control,
  name,
  required,
  label,
  isDisable,
  isReadOnly,
  rules,
  defaultValue,
}: Props<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={
        defaultValue &&
        (IOStringToCalendarDate(defaultValue) as PathValue<T, Path<T>>)
      }
      rules={
        required
          ? { required: `Please select a ${label ?? name}`, ...rules }
          : {}
      }
      render={({ field, fieldState: { invalid, error } }) => (
        <DateInput
          granularity="day"
          isInvalid={invalid}
          errorMessage={error?.message}
          {...field}
          defaultValue={defaultValue && IOStringToCalendarDate(defaultValue)}
          isDisabled={isDisable}
          isReadOnly={isReadOnly}
          labelPlacement="outside"
          label={label ?? name}
        />
      )}
    />
  );
};

export default DateSelect;
