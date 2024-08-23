import { FC } from "react";
import { Field } from "react-final-form";
import Link from "next/link";
import "./style.css";
import { FormApi } from "final-form";

interface CheckboxProps {
  name: string;
  form: FormApi;
}

const Checkbox: FC<CheckboxProps> = ({ name, form }) => {
  return (
    <div className="pt-5 pb-7">
      <div className="flex justify-start items-center gap-3">
        <Field
          name={name}
          type="checkbox"
          component="input"
          className="focus:ring-focus check-box text-accent focus:ring-3 dark:focus:ring-focus"
        />
        <p className="check-text">
          I agree with{" "}
          <Link className="underline" href="#">
            {" "}
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline">
            {" "}
            Privacy Policy
          </Link>
        </p>
      </div>
      {form.getState().submitFailed && form.getState().errors?.[name] && (
        <small className="text-red-600">{form.getState().errors?.[name]}</small>
      )}
    </div>
  );
};

export default Checkbox;
