import React from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { Field } from "react-final-form";
import "./style.css";
import { FormApi } from "final-form";

interface PasswordFieldProps {
  id: string;
  eyeState: boolean;
  toggleEye: () => void;
  placeholder: string;
  label: string;
  name: string;
  form: FormApi;
  onFocus?: () => void;
  onBlur?: () => void;
  eye?: React.ReactNode;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  eyeState,
  toggleEye,
  placeholder,
  label,
  name,
  form,
  onFocus,
  onBlur,
  eye,
}) => {
  return (
    <div className="relative mb-3 flex flex-col w-full lg:mb-0 2xl:mt-6 lg:mt-4 z-0">
      <label htmlFor={id} className="auth-label font-sans pb-2">
        {label}
      </label>
      <Field
        id={id}
        type={eyeState ? "text" : "password"}
        name={name}
        component="input"
        className="auth-input focus:outline-purple-800 focus:ring-focus focus:ring-1 font-sans border border-[#E0E0E0]"
        placeholder={placeholder}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {form.getState().submitFailed && form.getState().errors?.[name] && (
        <small className="text-red-600">{form.getState().errors?.[name]}</small>
      )}

      <div
        className="text-primary-gray absolute top-14 right-8 hover:cursor-pointer"
        onClick={toggleEye}
      >
        {eyeState ? <BsEye size={20} /> : <BsEyeSlash size={20} />}
      </div>
      <div
        className={`text-red-500 absolute top-14 right-2 hover:cursor-pointer`}
        onClick={toggleEye}
      >
        {eye}
      </div>
    </div>
  );
};

export default PasswordField;
