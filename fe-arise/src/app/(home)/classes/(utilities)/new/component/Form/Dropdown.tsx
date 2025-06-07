import { useMeaningfulContext } from "@/hooks";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Input,
  Spinner,
} from "@nextui-org/react";
import { ComponentProps, Key } from "react";
import { FaMinusCircle } from "react-icons/fa";
import { IoChevronDownOutline } from "react-icons/io5";
import { PiEmptyLight } from "react-icons/pi";
import { DropdownContext, OptionProps } from "./DropdownContextProvider";

export type Props = {
  children?: React.ReactNode[];
  required?: boolean;
  onChangeSelect?: (selections: OptionProps[]) => void;
  trigger?: React.ReactNode;
  showSelectedLabel?: boolean;
  showSelectedOptions?: boolean;
  utilities?: React.ReactNode;
  placement?: ComponentProps<typeof Dropdown>["placement"];
};

const Asterisk = () => <span className="text-red-500">*</span>;

export default function DropdownForm({
  showSelectedLabel = true,
  showSelectedOptions = true,
  trigger,
  utilities,
  placement,
  ...props
}: Readonly<Props>) {
  const {
    loading,
    options,
    label,
    selected,
    defaultSearchValue,
    setSearchValue,
    setSelected,
    selectionMode,
    required,
    disabled,
    isReadonly,
    setOpen,
    searchValue,
  } = useMeaningfulContext(DropdownContext);

  const renderOptions = () => {
    if (loading) {
      return (
        <DropdownItem key={"loading"}>
          <div className="flex justify-center">
            <Spinner color="default" />
          </div>
        </DropdownItem>
      );
    }

    if (
      !props.children ||
      (Array.isArray(props.children) && props.children.length === 0)
    ) {
      return <DropdownItem key={"empty"}>No options available</DropdownItem>;
    }

    return options
      .filter((o) => !selected.some((s) => s.key === o.key))
      .map((option, i) =>
        props.children?.[i] ? (
          <DropdownItem
            key={option.key}
            color="primary"
            showDivider
            variant="solid"
          >
            {props.children ? props.children[i] : undefined}
          </DropdownItem>
        ) : null
      );
  };

  const renderSelectedLabel = () => {
    if (!showSelectedLabel || selected.length === 0) {
      return (
        <p className="capitalize">
          {label}
          {required && <Asterisk />}
        </p>
      );
    }

    if (selectionMode === "single" || !selectionMode) {
      return (
        <>
          <p className="capitalize">
            {label}
            {required && <Asterisk />}:
          </p>
          <p>{selected[0].key}</p>
        </>
      );
    }

    return (
      <>
        <p className="capitalize">
          {label}
          {required && <Asterisk />}:
        </p>
        {selected.map((o) => (
          <span
            key={o.key}
            className="px-2 bg-orange-600 rounded-full text-white"
          >
            {o.key}
          </span>
        ))}
      </>
    );
  };

  const renderSelection = () => {
    if (!showSelectedOptions) {
      return null;
    }
    if (selected.length === 0) {
      return (
        <DropdownItem
          key={"non-selected"}
          closeOnSelect={false}
          className="bg-transparent"
          variant="solid"
          isReadOnly
          endContent={<PiEmptyLight size={15} />}
        >
          Select an option
        </DropdownItem>
      );
    }

    return selected.map((option) => {
      const value =
        !searchValue || searchValue === "" ? "XXXXs9d89sZXX" : searchValue;
      return (
        <DropdownItem
          key={`selected-${option.key}`}
          closeOnSelect={false}
          className={
            `${option.key} ${option.value}`
              .toLowerCase()
              .includes(value.toLowerCase())
              ? "bg-teal-200"
              : "bg-transparent"
          }
          variant="solid"
          showDivider
          color="danger"
          endContent={<FaMinusCircle size={15} />}
        >
          {option.key}
        </DropdownItem>
      );
    });
  };

  const updateSelection = (key: Key) => {
    if (key.toString().startsWith("selected-")) {
      selected.splice(
        selected.findIndex((o) => key.toString().endsWith(o.key)),
        1
      );

      setSelected([...selected]);
      if (props.onChangeSelect) {
        props.onChangeSelect(selected);
      }
      return;
    }

    const selectedOption = options.find((o) => o.key === key);
    if (!selectedOption) {
      return;
    }

    if (selectionMode === "single" || !selectionMode) {
      setSelected([selectedOption]);
      return;
    }

    setSelected([...selected, selectedOption]);
  };

  return (
    <>
      <input
        type="text"
        name={label}
        readOnly
        value={JSON.stringify(selected.map((s) => s.value))}
        hidden
      />
      {isReadonly ? (
        trigger ?? (
          <Button
            endContent={<IoChevronDownOutline size={10} />}
            variant="flat"
            size="sm"
          >
            {renderSelectedLabel()}
          </Button>
        )
      ) : (
        <Dropdown
          key={label}
          isDisabled={disabled}
          onOpenChange={setOpen}
          placement={placement}
        >
          <DropdownTrigger>
            {trigger ?? (
              <Button
                endContent={<IoChevronDownOutline size={10} />}
                variant="flat"
                size="sm"
              >
                {renderSelectedLabel()}
              </Button>
            )}
          </DropdownTrigger>
          <DropdownMenu
            disabledKeys={[
              "loading",
              "empty",
              "non-selected",
              ...(loading ? selected.map((s) => `selected-${s.key}`) : []),
              ...(loading ? options.map((s) => `${s.key}`) : []),
            ]}
            selectionMode="multiple"
            closeOnSelect={false}
            onAction={updateSelection}
            hideSelectedIcon
          >
            <DropdownItem
              classNames={{ base: "p-1" }}
              key={"input"}
              className="!bg-transparent cursor-default"
              variant="flat"
              isReadOnly
            >
              <Input
                autoFocus
                placeholder={`Search for ${label}`}
                variant="flat"
                size="md"
                isClearable
                defaultValue={defaultSearchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                classNames={{
                  inputWrapper: "border-1 hover:bg-transparent",
                }}
              />
            </DropdownItem>
            {utilities ? (
              <DropdownItem
                key={"utilities"}
                className="!bg-transparent cursor-default"
                variant="flat"
                isReadOnly
              >
                {utilities}
              </DropdownItem>
            ) : null}
            <DropdownSection className="max-h-48 overflow-y-auto">
              {renderSelection()}
            </DropdownSection>
            <DropdownSection
              title={"Results"}
              className="max-h-48 overflow-y-auto"
            >
              {renderOptions()}
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      )}
    </>
  );
}
