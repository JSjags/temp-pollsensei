import React from "react";
import { Field, FieldRenderProps } from "react-final-form";
import { cn } from "@/lib/utils";
import { FormApi } from "final-form";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  name: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  form: FormApi<any, Partial<any>>;
}

const SelectTag: React.FC<SelectProps> = ({
  label,
  name,
  options,
  placeholder = "Select an option",
  className,
  form,
  disabled = false,
}) => {
  return (
    <div className="mb-3 flex flex-col w-full">
      <label htmlFor={name} className="auth-label font-sans pb-2">
        {label}
      </label>
      <Field name={name}>
        {({ input, meta }: FieldRenderProps<string, HTMLSelectElement>) => (
          <div>
            <select
              {...input}
              disabled={disabled}
              className={cn(
                "auth-input focus:outline-purple-800 focus:ring-focus focus:ring-1 font-sans border border-border text-foreground w-full placeholder:text-foreground/40",
                className
              )}
            >
              <option value="">{placeholder}</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {meta.touched && meta.error && (
              <small className="text-red-600">{meta.error}</small>
            )}
          </div>
        )}
           {/* {form.getState().submitFailed && form.getState().errors?.[name] && (
        <small className="text-red-600">
          {form.getState().errors?.[name] ?? ""}
        </small>
      )} */}
      </Field>
    </div>
  );
};

export default SelectTag;
