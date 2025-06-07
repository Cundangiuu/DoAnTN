"use client";

import { Textarea } from "@nextui-org/react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  required?: boolean;
  label?: string;
  isDisable?: boolean;
  isReadOnly?: boolean;
  rules?: object;
  placeholder?: string;
};

const TextArea = <T extends FieldValues>({
  control,
  name,
  required,
  label,
  isDisable,
  rules,
  isReadOnly,
  placeholder,
}: Props<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={
        required ? { required: `Please fill ${label ?? name}`, ...rules } : {}
      }
      render={({ field, fieldState: { invalid, error } }) => (
        <Textarea
          {...field}
          isDisabled={isDisable}
          isReadOnly={isReadOnly}
          labelPlacement="outside"
          label={label ?? name}
          placeholder={placeholder}
          value={field.value ?? ""}
          isInvalid={invalid}
          errorMessage={error?.message}
        />
      )}
    />
  );
};

export default TextArea;
