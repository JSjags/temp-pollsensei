import React from "react";
import { Field } from "react-final-form";
import "./style.css";
import { FormApi } from "final-form";

interface TextAreaProps {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  form: FormApi;
}

const TextArea: React.FC<TextAreaProps> = ({
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
      <Field
        name={name}
        type={type}
        component="textarea"
        className="auth-text-area capitalize px-5 pt-5 pb-14 focus:outline-none focus:ring-focus focus:ring-1 font-sans border border-[#E0E0E0]"
        placeholder={placeholder}
      />
      {form.getState().submitFailed && form.getState().errors?.[name] && (
        <small className="text-red-600">{form.getState().errors?.[name]}</small>
      )}
    </div>
  );
};

export default TextArea;
