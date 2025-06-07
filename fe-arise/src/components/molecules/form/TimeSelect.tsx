"use client";

import { parseTime } from "@internationalized/date";
import { TimeInput } from "@nextui-org/react";
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
  rules?: object;
  defaultValue?: PathValue<T, Path<T>> | undefined;
};

const TimeSelect = <T extends FieldValues>({
  control,
  name,
  required,
  label,
  isDisable,
  rules,
  defaultValue,
}: Props<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={
        defaultValue &&
        (parseTime(String(defaultValue).split(" ")[1]) as PathValue<T, Path<T>>)
      }
      rules={
        required
          ? { required: `Please select a ${label ?? name}`, ...rules }
          : {}
      }
      render={({ field, fieldState: { invalid, error } }) => (
        <TimeInput
          {...field}
          hourCycle={24}
          defaultValue={
            defaultValue && parseTime(String(defaultValue).split(" ")[1])
          }
          isDisabled={isDisable}
          labelPlacement="outside"
          label={label ?? name}
          isInvalid={invalid}
          errorMessage={error?.message}
        />
      )}
    />
  );
};

export default TimeSelect;
