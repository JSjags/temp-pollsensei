import React from "react";
import { Field } from "react-final-form";
import "./style.css";
import { FormApi } from "final-form";

interface InputProps {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  form: FormApi;
  initialValue: string;
  readOnly?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  type,
  placeholder,
  form,
  initialValue,
  readOnly,
}) => {
  return (
    <div className="mb-3 flex flex-col w-full">
      <label htmlFor={name} className="auth-label font-sans pb-2">
        {label}
      </label>
      <Field
        name={name}
        type={type}
        component="input"
        className="auth-input focus:outline-purple-800 focus:ring-focus focus:ring-1 font-sans border border-border text-foreground"
        placeholder={placeholder}
        initialValue={initialValue}
        readOnly={readOnly}
      />
      {form.getState().submitFailed && form.getState().errors?.[name] && (
        <small className="text-red-600">{form.getState().errors?.[name]}</small>
      )}
    </div>
  );
};

export default Input;
