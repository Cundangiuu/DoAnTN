import {
  DateValue,
  DateRangePicker as NextUIDateRangePicker,
  RangeValue,
} from "@nextui-org/react";
import {
  Control,
  Controller,
  ControllerProps,
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
  rules?: ControllerProps["rules"];
  defaultValue?: PathValue<T, Path<T>>;
  showLabel?: boolean;
};

const DateRangePicker = <T extends FieldValues>({
  control,
  name,
  required,
  label,
  isDisable,
  isReadOnly,
  rules,
  defaultValue,
  showLabel,
}: Props<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue as PathValue<T, Path<T>>}
      rules={
        (required
          ? { required: `Please select a ${label ?? name}`, ...rules }
          : {}) as object
      }
      render={({ field, fieldState: { invalid, error } }) => (
        <NextUIDateRangePicker
          disableAnimation
          granularity="day"
          isInvalid={invalid}
          errorMessage={error?.message}
          {...field}
          defaultValue={defaultValue as RangeValue<DateValue>}
          isDisabled={isDisable}
          isReadOnly={isReadOnly}
          labelPlacement="outside"
          {...(showLabel ? { label: label ?? name } : {})}
        />
      )}
    />
  );
};

export default DateRangePicker;
