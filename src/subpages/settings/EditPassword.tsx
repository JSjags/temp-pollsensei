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

  const pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

  const toggleEye = (field: string) => {
    setEyeState((prevState) => ({
      ...prevState,
      [field]: !prevState[field as keyof typeof prevState],
    }));
  };

  const onSubmit = async (values: any) => {
    try {
      await updateUserPassword(values).unwrap();
      toast.success("User password updated successfully");
      router.push("/settings/account-settings");
    } catch (err: any) {
      toast.error(
        "Failed to update user password " + err?.data?.message || err.message
      );
    }
  };

  const validateForm = (values: any) => {
    return validate(values, constraints) || {};
  };

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-[4.4rem] py-6 md:py-8 lg:py-[3.88rem]">
      <div
        onClick={() => router.back()}
        className="cursor-pointer mb-4 md:mb-6"
      >
        <HiArrowNarrowLeft className="text-xl md:text-2xl" />
      </div>

      <div className="w-full max-w-2xl mx-auto">
        <Form
          onSubmit={onSubmit}
          validate={validateForm}
          render={({ handleSubmit, form, submitting, values }) => (
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <p className="text-xs sm:text-sm flex items-center gap-2 text-gray-600">
                <CiCircleQuestion className="text-xl sm:text-2xl" />
                Your password must be different from the previously used
                passwords.
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
                className={`${
                  pwdFocus && !validPwd ? "block" : "hidden"
                } bg-gray-50 p-4 rounded-lg`}
              >
                <h5 className="text-[#979DA3] text-sm font-medium mb-3">
                  YOUR PASSWORD MUST CONTAIN
                </h5>
                <ul className="text-[#979DA3] space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <ValidatePwdIcon
                      color={
                        values.newPassword?.length >= 8 ? "#2ECC71" : "#E66767"
                      }
                    />
                    Between 8 and 20 characters
                  </li>
                  <li className="flex items-center gap-2">
                    <ValidatePwdIcon
                      color={
                        /[A-Z]/.test(values.newPassword) ? "#2ECC71" : "#E66767"
                      }
                    />
                    1 upper case letter
                  </li>
                  <li className="flex items-center gap-2">
                    <ValidatePwdIcon
                      color={
                        /\d/.test(values.newPassword) ? "#2ECC71" : "#E66767"
                      }
                    />
                    1 or more numbers
                  </li>
                  <li className="flex items-center gap-2">
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

              <div className="pt-4">
                <button
                  className="w-full sm:w-auto px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[150px]"
                  type="submit"
                  disabled={submitting || isLoading}
                >
                  {submitting || isLoading ? (
                    <ClipLoader size={20} color="#ffffff" />
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
