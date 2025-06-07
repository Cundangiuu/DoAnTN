"use client";

import { Chip, Input } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
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
  label?: string;
  isDisable?: boolean;
  placeholder?: string;
  rules?: object;
  defaultSelectedKeys?: (string | number)[];
};

const SearchableMultiSelect = <T extends FieldValues>({
  control,
  name,
  options,
  required,
  label,
  rules,
  isDisable = false,
  placeholder = "Search and select...",
  defaultSelectedKeys = [],
}: Props<T>) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      rules={
        required
          ? { required: `Please select a ${label ?? name}`, ...rules }
          : {}
      }
      render={({ field }) => {
        const selectedItems = field.value || defaultSelectedKeys;

        const toggleSelection = (key: string | number) => {
          const newSelected = selectedItems.includes(key)
            ? selectedItems.filter((k: string | number) => k !== key)
            : [...selectedItems, key];

          field.onChange(newSelected);
        };

        return (
          <div className="relative w-full z-[100]" ref={dropdownRef}>
            {/* Selected Tags */}
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedItems.map((key: string | number) => {
                const option = options.find((opt) => opt.key === key);
                return (
                  <Chip
                    key={key}
                    onClose={isDisable ? undefined : () => toggleSelection(key)}
                    color="primary"
                    variant="bordered"
                    className="cursor-pointer"
                  >
                    {option?.label}
                  </Chip>
                );
              })}
            </div>

            {/* Search Input */}
            <Input
              type="text"
              placeholder={placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsOpen(true)}
              isDisabled={isDisable}
            />

            {/* Dropdown List */}
            {isOpen && (
              <div className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                {options
                  .filter((option) =>
                    option.label.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((option) => (
                    <div
                      key={option.key}
                      className={`px-3 py-2 cursor-pointer flex items-center gap-2 ${
                        selectedItems.includes(option.key)
                          ? "bg-gray-200"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => toggleSelection(option.key)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(option.key)}
                        readOnly
                      />
                      {option.label}
                    </div>
                  ))}
                {options.length === 0 && (
                  <p className="px-3 py-2 text-gray-500">No results found</p>
                )}
              </div>
            )}
          </div>
        );
      }}
    />
  );
};

export default SearchableMultiSelect;
