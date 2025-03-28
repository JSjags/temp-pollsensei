"use client";
import React from "react";
import { UseFormRegister, FieldError } from "react-hook-form";

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  register: UseFormRegister<any>;
  error?: FieldError;
  disabled?: boolean;
  className?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type = "text",
  placeholder = "",
  required = false,
  register,
  error,
  disabled = false,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={id} className="text-[#333333] text-sm">
        {label} {required && "(Required)"}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className={`w-full h-auto border-2 border-[#E0E0E0] text-black text-base rounded-md py-2 px-3 active:outline-none ${
          disabled ? "bg-gray-100" : ""
        }`}
        {...register(id)}
        disabled={disabled}
      />
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
};
