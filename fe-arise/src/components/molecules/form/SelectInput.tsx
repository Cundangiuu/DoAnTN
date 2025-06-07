"use client";

import { Chip, Select, SelectedItems, SelectItem } from "@nextui-org/react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

type OptionType = {
  key: string | number;
  label: string;
};

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  options: OptionType[];
  required?: boolean;
  multiple?: boolean;
  label?: string;
  isDisable?: boolean;
  placeholder?: string;
  rules?: object;
  defaultSelectedKey?: (string | number)[];
};

const capitalize = (string: string) => {
  return string.charAt(0).toLocaleUpperCase() + string.slice(1);
};

const SelectInput = <T extends FieldValues>({
  control,
  name,
  options,
  required,
  multiple,
  label,
  rules,
  isDisable = false,
  placeholder,
  defaultSelectedKey,
}: Props<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={
        required
          ? { required: `Please select a ${label ?? name}`, ...rules }
          : {}
      }
      render={({ field, fieldState: { invalid, error } }) => {
        return (
          <Select
            {...field}
            classNames={{
              trigger: "py-2",
            }}
            isInvalid={invalid}
            errorMessage={error?.message}
            defaultSelectedKeys={defaultSelectedKey}
            isDisabled={isDisable}
            items={options}
            selectionMode={multiple ? "multiple" : "single"}
            label={label ? capitalize(label) : capitalize(name as string)}
            labelPlacement="outside"
            placeholder={placeholder}
            onChange={(event) => {
              field.onChange(
                multiple ? event.target.value.split(",") : event.target.value
              );
            }}
            isMultiline={multiple}
            renderValue={(items: SelectedItems<OptionType>) => {
              return (
                <div className="flex flex-wrap gap-2">
                  {items.map((item) =>
                    multiple ? (
                      <Chip color="primary" key={item.key}>
                        {item.data?.label}
                      </Chip>
                    ) : (
                      <p key={item.key}>{item.data?.label}</p>
                    )
                  )}
                </div>
              );
            }}
          >
            {(option) => (
              <SelectItem key={option.key} textValue={option.label}>
                <p>{option.label}</p>
              </SelectItem>
            )}
          </Select>
        );
      }}
    />
  );
};

export default SelectInput;
