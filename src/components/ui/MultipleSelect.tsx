import React from "react";
import Select, { MultiValue, ActionMeta } from "react-select";
import makeAnimated from "react-select/animated";

interface Option {
  value: string;
  label: string;
}

interface InputProps {
  onChange: (value: MultiValue<Option>) => void;
  value: MultiValue<Option>;
}

interface MetaProps {
  touched: boolean;
  error?: string;
}

interface MultiSelectFieldProps {
  input: InputProps;
  meta: MetaProps;
  customStyles?: object;
  defaultValue?:Option[];
  label: string;
  [key: string]: any;
}

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  input,
  meta,
  label,
  customStyles,
  defaultValue,
  ...rest
}) => {
  const handleChange = (
    value: MultiValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => {
    input.onChange(value);
  };

  return (
    <div>
      <label htmlFor="">{label}</label>
      <Select<Option, true>
        {...input}
        {...rest}
        styles={customStyles}
        value={input.value}
        onChange={handleChange}
        components={makeAnimated()}
        className="mt-2"
        isMulti
        defaultValue={defaultValue}
      />
      {meta.touched && meta.error && (
        <span className="text-red-600 text-sm">{meta.error}</span>
      )}
    </div>
  );
};

export default MultiSelectField;
