"use client";

import { Input } from "@nextui-org/react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  required?: boolean;
  label?: string;
  isDisable?: boolean;
  isReadOnly?: boolean;
  rules?: object;
  type?: "text" | "email" | "url" | "password" | "tel" | "search" | "number";
  placeholder?: string;
};

const TextInput = <T extends FieldValues>({
  control,
  name,
  required,
  label,
  isDisable,
  isReadOnly,
  rules,
  type,
  placeholder,
}: Props<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={
        required ? { required: `Please fill ${label ?? name}`, ...rules } : {}
      }
      render={({ field, fieldState }) => {
        return (
          <Input
            {...field}
            type={type}
            isDisabled={isDisable}
            isReadOnly={isReadOnly}
            labelPlacement="outside"
            label={label ?? name}
            value={field.value ?? ""}
            onChange={field.onChange}
            placeholder={placeholder}
            isInvalid={fieldState.invalid}
            errorMessage={fieldState.error?.message}
          />
        );
      }}
    />
  );
};

export default TextInput;
