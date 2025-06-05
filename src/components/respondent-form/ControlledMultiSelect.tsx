"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IoChevronDownOutline, IoClose } from "react-icons/io5";
import { Checkbox } from "@/components/ui/shadcn-checkbox";
import { Controller, Control, FieldError } from "react-hook-form";

interface ControlledMultiSelectProps {
  name: string;
  control: Control<any>;
  options: { value: string; label: string }[];
  label: string;
  placeholder?: string;
  // error?: FieldError;
  error?: any;
  disabled?: boolean;
  className?: string;
  otherFieldName?: string;
  register?: any;
  required?: boolean;
  contentWidth?: string;
  contentHeight?: string;
}

export const ControlledMultiSelect: React.FC<ControlledMultiSelectProps> = ({
  name,
  control,
  options,
  label,
  placeholder = "Select Option",
  error,
  disabled = false,
  className = "",
  otherFieldName,
  register,
  required = false,
  contentWidth = "450px",
  contentHeight = "auto",
}) => {
  const handleItemChange = (field: any, item: string, checked: boolean) => {
    const updatedItems = checked
      ? [...field.value, item]
      : field.value.filter((p: string) => p !== item);
    field.onChange(updatedItems);
  };

  const removeItem = (field: any, item: string) => {
    const updatedItems = field.value.filter((p: string) => p !== item);
    field.onChange(updatedItems);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={name} className="text-[#333333] text-sm">
        {label} {required && "(Required)"}
      </label>
      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                className="w-full h-auto border-2 border-[#E0E0E0] text-black text-sm rounded-md py-2 px-3 active:outline-none"
                disabled={disabled}
              >
                <Button
                  variant="outline"
                  size="default"
                  className="w-full flex items-center justify-between"
                >
                  <span>{placeholder}</span>
                  <IoChevronDownOutline className="text-[#898989] text-lg" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className={`w-[${contentWidth}] h-[${contentHeight}] flex flex-col overflow-auto scrollbar-hide`}
              >
                {options.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center gap-2 w-full hover:bg-[#CB85FD1A] px-5 rounded-sm"
                  >
                    <Checkbox
                      id={`${name}-${option.value}`}
                      checked={field.value.includes(option.value)}
                      onCheckedChange={(checked) =>
                        handleItemChange(field, option.value, !!checked)
                      }
                    />
                    <DropdownMenuLabel className="text-base capitalize font-normal">
                      {option.label}
                    </DropdownMenuLabel>
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex flex-wrap gap-2">
              {field.value.map((item: string) => {
                const option = options.find((opt) => opt.value === item);
                return (
                  <div
                    key={item}
                    className={`flex items-center gap-1 bg-[#E8DEF8] rounded-xl py-1 px-2 ${
                      item.includes("other") ? "hidden" : "inline-block"
                    }`}
                  >
                    <span className="text-sm capitalize">
                      {option?.label || item}
                    </span>
                    <IoClose
                      className="text-lg cursor-pointer"
                      onClick={() => removeItem(field, item)}
                    />
                  </div>
                );
              })}
            </div>

            {field.value.includes("other") && otherFieldName && register && (
              <input
                type="text"
                placeholder="Other (Please specify)"
                className="w-full h-auto px-2 py-1 border-2 border-[#E0E0E0] text-black text-sm rounded-md mt-2"
                {...register(otherFieldName)}
                autoFocus
              />
            )}
          </>
        )}
      />
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
};
