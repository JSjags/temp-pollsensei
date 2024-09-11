import React from "react";
import { Field, FieldRenderProps } from "react-final-form";
import "./style.css";
import { FormApi } from "final-form";
import { cn } from "@/lib/utils";

interface InputProps {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  form: FormApi<any, Partial<any>>;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  type,
  placeholder,
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
        {({ input }: FieldRenderProps<string, HTMLInputElement>) => (
          <input
            {...input}
            type={type}
            disabled={disabled}
            className={cn(
              "auth-input focus:outline-purple-800 focus:ring-focus focus:ring-1 font-sans border border-border text-foreground placeholder:text-foreground/40",
              className
            )}
            placeholder={placeholder}
          />
        )}
      </Field>
      {form.getState().submitFailed && form.getState().errors?.[name] && (
        <small className="text-red-600">
          {form.getState().errors?.[name] ?? ""}
        </small>
      )}
    </div>
  );
};

export default Input;
