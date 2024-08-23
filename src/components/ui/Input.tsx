import React from "react";
import { Field, FieldRenderProps } from "react-final-form";
import "./style.css";
import { FormApi } from "final-form";

interface InputProps {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  form: FormApi<any, Partial<any>>;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  type,
  placeholder,
  form,
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
            className="auth-input focus:outline-none focus:ring-focus focus:ring-1 font-sans border border-[#E0E0E0]"
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
