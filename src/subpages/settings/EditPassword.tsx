"use client";

import { HiArrowNarrowLeft } from "react-icons/hi";
import { useRouter } from "next/router";
import ValidatePwdIcon from "../auth/ValidatePwdIcon";
import { IoCheckmarkCircle } from "react-icons/io5";
import { FaTimesCircle } from "react-icons/fa";
import PasswordField from "../../components/ui/PasswordField";
import { Field, Form } from "react-final-form";
import { useState } from "react";
import { validate } from "validate.js";
import { ClipLoader } from "react-spinners";
import { useUpdateUserPasswordMutation } from "../../services/user.service";
import { CiCircleQuestion } from "react-icons/ci";
import { toast } from "react-toastify";

const constraints = {
  oldPassword: {
    presence: true,
    equality: {
      attribute: "oldPassword",
      message: "^Passwords do not match",
    },
  },
  newPassword: {
    presence: true,
    length: {
      minimum: 8,
    },
    format: {
      pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
      message:
        "^Password must be between 8 and 20 characters long, n/ contain at least one uppercase letter, one number, n/ and one special character",
    },
  },
  confirmNewPassword: {
    presence: true,
    equality: {
      attribute: "newPassword",
      message: "^Passwords do not match",
    },
  },
};

const EditPassword: React.FC = () => {
  const router = useRouter();
  const [updateUserPassword, { isLoading }] = useUpdateUserPasswordMutation();
  const [eyeState, setEyeState] = useState({
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const [pwdFocus, setPwdFocus] = useState(false);
  const [validPwd] = useState(false);

  const [matchFocus, setMatchFocus] = useState(false);
  console.log(matchFocus);

  const pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

  const toggleEye = (field: string) => {
    setEyeState((prevState) => ({
      ...prevState,
      [field]: !prevState[field as keyof typeof prevState],
    }));
  };

  const onSubmit = async (values: any) => {
    console.log(values);
    try {
      await updateUserPassword(values).unwrap();
      toast.success("User password updated successfully");
      router.push("/settings/account-settings");
      console.log("User password updated successfully");
    } catch (err: any) {
      toast.error(
        "Failed to update user password " + err?.data?.message || err.message
      );
      console.error("Failed to update user password", err);
    }
  };

  const validateForm = (values: any) => {
    return validate(values, constraints) || {};
  };

  return (
    <div className="px-[2rem] lg:px-[4.4rem] flex flex-col py-[3.88rem]">
      <div onClick={() => router.back()} className="cursor-pointer">
        <HiArrowNarrowLeft className="text-2xl" />
      </div>
      <div className="flex flex-col w-full lg:w-2/3 pb-5 mt-5 lg:px-4">
        <Form
          onSubmit={onSubmit}
          validate={validateForm}
          render={({ handleSubmit, form, submitting, values }) => (
            <form onSubmit={handleSubmit}>
              <Field name="oldPassword">
                {({ input, meta }) => (
                  <PasswordField
                    id="oldPassword"
                    eyeState={eyeState.oldPassword}
                    toggleEye={() => toggleEye("oldPassword")}
                    placeholder="*******"
                    label="Old Password"
                    form={form}
                    {...input}
                    // error={meta.touched && meta.error}
                  />
                )}
              </Field>

              <Field name="newPassword">
                {({ input, meta }) => (
                  <PasswordField
                    id="newPassword"
                    eyeState={eyeState.newPassword}
                    toggleEye={() => toggleEye("newPassword")}
                    placeholder="*******"
                    label="New Password"
                    form={form}
                    {...input}
                    // error={meta.touched && meta.error}
                    onFocus={() => {
                      input.onFocus();
                      setPwdFocus(true);
                    }}
                    onBlur={() => {
                      input.onBlur();
                      setPwdFocus(false);
                    }}
                    eye={
                      (
                        <small className="icon-container">
                          {!meta.active && !pattern.test(input.value) ? (
                            ""
                          ) : pattern.test(input.value) ? (
                            <IoCheckmarkCircle
                              className="text-green-600"
                              size={20}
                            />
                          ) : (
                            <FaTimesCircle className="text-red-600" size={20} />
                          )}
                        </small>
                      ) as any
                    }
                  />
                )}
              </Field>

              <p className="text-xs flex items-center my-3 gap-2">
                {" "}
                <CiCircleQuestion className="text-2xl" /> Your password must be
                different from the previously used passwords.
              </p>

              <Field name="confirmNewPassword">
                {({ input, meta }) => (
                  <PasswordField
                    id="confirmNewPassword"
                    eyeState={eyeState.confirmNewPassword}
                    toggleEye={() => toggleEye("confirmNewPassword")}
                    placeholder="*******"
                    label="Confirm New Password"
                    form={form}
                    {...input}
                    // error={meta.touched && meta.error}
                    onFocus={() => {
                      input.onFocus();
                      setMatchFocus(true);
                    }}
                    onBlur={() => {
                      input.onBlur();
                      setMatchFocus(false);
                    }}
                    eye={
                      (
                        <small className="icon-container">
                          {!meta.active ? (
                            ""
                          ) : input.value === values.newPassword ? (
                            <IoCheckmarkCircle
                              className="text-green-600"
                              size={20}
                            />
                          ) : (
                            <FaTimesCircle className="text-red-600" size={20} />
                          )}
                        </small>
                      ) as any
                    }
                  />
                )}
              </Field>

              <div
                id="pwdnote"
                className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
              >
                <h5 className="text-[#979DA3] ">YOUR PASSWORD MUST CONTAIN</h5>
                <ul className="text-[#979DA3] mt-">
                  <li className="flex mb-3 items-center gap-2">
                    <ValidatePwdIcon
                      color={
                        values.newPassword?.length >= 8 ? "#2ECC71" : "#E66767"
                      }
                    />
                    Between 8 and 20 characters
                  </li>
                  <li className="flex mb-3 items-center gap-2">
                    <ValidatePwdIcon
                      color={
                        /[A-Z]/.test(values.newPassword) ? "#2ECC71" : "#E66767"
                      }
                    />
                    1 upper case letter
                  </li>
                  <li className="flex mb-3 items-center gap-2">
                    <ValidatePwdIcon
                      color={
                        /\d/.test(values.newPassword) ? "#2ECC71" : "#E66767"
                      }
                    />
                    1 or more numbers
                  </li>
                  <li className="flex mb-3 items-center gap-2">
                    <ValidatePwdIcon
                      color={
                        /[@#&$!]/.test(values.newPassword)
                          ? "#2ECC71"
                          : "#E66767"
                      }
                    />
                    1 or more special characters
                  </li>
                </ul>
              </div>

              <div className="mt-4">
                <button
                  className="auth-btn w-full lg:w-1/2 justify-center"
                  type="submit"
                  disabled={submitting || isLoading}
                >
                  {submitting || isLoading ? (
                    <ClipLoader size={20} />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          )}
        />
      </div>
    </div>
  );
};

export default EditPassword;
