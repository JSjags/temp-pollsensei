"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, Control, FieldError } from "react-hook-form";

interface ControlledSelectProps {
  name: string;
  control: Control<any>;
  options: { value: string; label: string }[];
  placeholder: string;
  label: string;
  required?: boolean;
  error?: FieldError;
  disabled?: boolean;
  className?: string;
  otherFieldName?: string;
  register?: any;
}

export const ControlledSelect: React.FC<ControlledSelectProps> = ({
  name,
  control,
  options,
  placeholder,
  label,
  required = false,
  error,
  disabled = false,
  className = "",
  otherFieldName,
  register,
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={name} className="text-[#333333] text-sm">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <Select
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
              disabled={disabled}
            >
              <SelectTrigger
                className={`w-full h-auto border-2 border-[#E0E0E0] text-black text-sm rounded-md py-2 px-3 active:outline-none ${
                  disabled ? "bg-gray-100" : ""
                }`}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent className="w-full h-auto">
                <SelectGroup>
                  {options.map((option) => (
                    <SelectItem
                      value={option.value}
                      className="text-base"
                      key={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {field.value === "other" && otherFieldName && register && (
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