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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";
import { addCriteria, removeCriteria } from "@/redux/slices/criteriaSlice";

interface DropdownSelectProps {
  name: string;
  control: any;
  options: Array<{ label: string; value?: string }>;
  selectedCriteria: any;
  tab: string;
  section: string;
  dispatch: any;
  required?: boolean;
  title: string;
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({
  name,
  control,
  options,
  selectedCriteria,
  tab,
  section,
  dispatch,
  required = false,
  title,
}) => {
  const handleCheckboxChange = (field: any, item: string, checked: boolean) => {
    const updatedValues = checked
      ? [...field.value, item]
      : field.value.filter((i: string) => i !== item);

    field.onChange(updatedValues);

    if (checked) {
      dispatch(addCriteria({ tab, section, criteria: item }));
    } else {
      dispatch(removeCriteria({ tab, section, criteria: item }));
    }
  };

  const removeItem = (field: any, item: string) => {
    const updatedItems = field.value.filter((i: string) => i !== item);
    field.onChange(updatedItems);
    dispatch(removeCriteria({ tab, section, criteria: item }));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="w-full flex justify-between items-center pl-10">
        <p className="text-[#333333] text-sm">{title}</p>
        <div className="flex items-center space-x-2">
          <Switch id={name} className="h-5" />
          <Label htmlFor={name} className="text-[#333333] text-sm font-normal">
            Required
          </Label>
        </div>
      </div>
      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <div className="relative w-full h-auto flex flex-col gap-2 pl-10">
            <Checkbox
              className="absolute left-0 top-[30%] -translate-y-1/2"
              checked={selectedCriteria[section]?.length > 0}
            />
            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                className="w-full h-auto border-2 border-[#E0E0E0] text-black text-sm rounded-md py-2 px-3 active:outline-none"
              >
                <Button
                  variant="outline"
                  size="default"
                  className="w-full flex items-center justify-between"
                >
                  <span>Select Option</span>
                  <IoChevronDownOutline className="text-[#898989] text-lg" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[450px] flex flex-col">
                {options.map((option) => (
                  <div
                    key={option.label}
                    className={`items-center gap-2 w-full hover:bg-[#CB85FD1A] px-5 rounded-sm ${
                      option?.value === "other" ? "hidden" : "flex"
                    }`}
                  >
                    <Checkbox
                      id={option.label}
                      checked={field.value?.includes(option.label)}
                      onCheckedChange={(checked) => {
                        handleCheckboxChange(field, option.label, !!checked);
                      }}
                    />
                    <DropdownMenuLabel className="text-base capitalize font-normal">
                      {option.label}
                    </DropdownMenuLabel>
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex flex-wrap gap-2">
              {field.value?.map((option: string) => (
                <div
                  key={option}
                  className="flex items-center gap-1 bg-[#E8DEF8] rounded-xl py-1 px-2"
                >
                  <span className="text-sm capitalize">{option}</span>
                  <IoClose
                    className="text-lg cursor-pointer"
                    onClick={() => removeItem(field, option)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default DropdownSelect;
