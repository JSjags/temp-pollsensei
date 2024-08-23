"use client";

import { useState } from "react";
import Image from "next/image";
import { Form, Field } from "react-final-form";
import validate from "validate.js";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import OtpInput from "react-otp-input";
import { FaTimesCircle } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";

import steps from "../../assets/auth/steps2.svg";
import logo from "../../assets/auth/logo.svg";
import {
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useVerifyOTPMutation,
} from "../../services/user.service";
import StateLoader from "../../components/common/StateLoader";
import PasswordField from "../../components/ui/PasswordField";
import Input from "@/components/ui/Input";
import ValidatePwdIcon from "./ValidatePwdIcon";

const constraints = {
  email: {
    presence: true,
    email: true,
  },
};

const otpConstraints = {
  code: {
    presence: true,
    length: {
      is: 4,
    },
  },
};

const newPswdConstraints = {
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
  confirmPassword: {
    presence: true,
    equality: {
      attribute: "newPassword",
      message: "^Passwords do not match",
    },
  },
};

const customInputStyle = {
  width: "3rem",
  height: "3rem",
  marginRight: "1rem",
  fontSize: "2rem",
  borderRadius: "4px",
  border: "1px solid #9D50BB",
};

const ForgotPasswordPage: React.FC = () => {
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();
  const [verifyOTP, { isLoading: isLoadingOtp }] = useVerifyOTPMutation();
  const [resetPassword, { isLoading: isReset }] = useResetPasswordMutation();
  const [emailInput, setEmailInput] = useState(true);
  const [otpInput, setOtpInput] = useState(false);
  const [createNewPswd, setCreateNewPswd] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [eyeState, setEyeState] = useState({
    password: false,
    confirmPassword: false,
  });

  const [pwdFocus, setPwdFocus] = useState(false);
  const [validPwd] = useState(false);

  const [matchFocus, setMatchFocus] = useState(false);

  const pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

  const toggleEye = (field: "password" | "confirmPassword") => {
    setEyeState((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const onSubmit = async (values: { email: string }) => {
    try {
      setEmail(values.email);
      await forgetPassword(values).unwrap();
      toast.success("Check your email for your password reset code");
      setEmailInput(false);
      setOtpInput(true);
      console.log("Check your email for your password reset code");
    } catch (err: any) {
      toast.error("Failed " + err?.data?.message || err.message);
      console.error("Failed ", err?.data?.message || err.message);
    }
  };

  const validateForm = (values: any) => {
    return validate(values, constraints) || {};
  };

  const onSubmitOtp = async (values: { code: string }) => {
    try {
      const otpData = { ...values, code: parseInt(values.code, 10), email };
      console.log(otpData);
      await verifyOTP(otpData).unwrap();
      toast.success("OTP verified successfully");
      setOtpInput(false);
      setCreateNewPswd(true);

      console.log("OTP verified successfully");
    } catch (err: any) {
      toast.error("Failed " + err?.data?.message || err.message);
      console.error("Failed ", err?.data?.message || err.message);
    }
  };

  const validateOTPForm = (values: any) => {
    return validate(values, otpConstraints) || {};
  };

  const createNewPswdHandler = async (values: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      const reset_data = { ...values, email };
      console.log(reset_data);
      await resetPassword(reset_data).unwrap();
      toast.success("Password reset was successful");
      setCreateNewPswd(false);
      setLoading(true);
      console.log("Password reset was successful");
    } catch (err: any) {
      toast.error("Failed " + err?.data?.message || err.message);
      console.error("Failed ", err?.data?.message || err.message);
    }
  };

  const validateFormPswdForm = (values: any) => {
    return validate(values, newPswdConstraints) || {};
  };

  return (
    <section className="min-h-screen flex flex-col md:flex-row">
      {/* Header for smaller screens */}
      <div className="md:hidden auth-bg w-full flex items-center justify-center p-4">
        <div className="flex items-center gap-3">
          <Image src={logo} alt="" className="h-8" width={32} height={32} />
          <h1 className="auth-head">PollSensei</h1>
        </div>
      </div>

      {/* Content for larger screens */}
      <div className="hidden md:flex auth-bg w-full flex-col justify-center items-center">
        <div className="">
          <div className="flex items-center justify-center gap-3 pb-10">
            <Image src={logo} alt="Logo" width={32} height={32} />
            <h1 className="auth-head">PollSensei</h1>
          </div>

          <Image
            src={steps}
            alt="Steps"
            className="pb-4 w-full max-w-[400px] h-auto"
            width={300}
            height={200}
          />

          <h3 className="auth-heading pb-8">
            Create End-to- End <br /> Surveys with our AI tool
          </h3>
          <h5 className="auth-subtitle">
            PollSensei helps you to Create suggest questions, <br /> formats,
            methodologies{" "}
          </h5>
        </div>
      </div>

      <div className="w-full flex flex-col justify-center items-center px-5">
        {emailInput && (
          <div className="flex justify-center flex-col max-w-[516px] w-full">
            <div className="flex-col flex pb-10 pt-10">
              <h2 className="auth-header font-sans">Forgot Password?</h2>
              <p className="auth-title font-sans pt-3">
                Not to worry. We will help you recover it
              </p>
            </div>

            <Form
              onSubmit={onSubmit}
              validate={validateForm}
              render={({ handleSubmit, form, submitting }) => (
                <form onSubmit={handleSubmit}>
                  <Field name="email">
                    {({ input, meta }) => (
                      <Input
                        label="Email"
                        type="text"
                        placeholder="Enter your Email"
                        form={form}
                        {...input}
                      />
                    )}
                  </Field>

                  <button
                    className="auth-btn w-full justify-center"
                    type="submit"
                    disabled={submitting || isLoading}
                  >
                    {submitting || isLoading ? (
                      <ClipLoader size={20} />
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </form>
              )}
            />
          </div>
        )}

        {/* OTP FORM */}
        {otpInput && (
          <div className="flex justify-center flex-col max-w-[516px] w-full">
            <div className="flex-col flex pb- pt-10">
              <h2 className="auth-header font-sans">Verify that it is you</h2>
              <p className="auth-title font-sans pt-3">
                We sent a code to your email
              </p>
            </div>

            <Form
              onSubmit={onSubmitOtp}
              validate={validateOTPForm}
              render={({ handleSubmit, submitting }) => (
                <form onSubmit={handleSubmit}>
                  <Field
                    name="code"
                    render={({ input, meta }) => (
                      <div className="pt-5 pb-5">
                        <label className="auth-label font-sans pb-2">
                          Verification Code
                        </label>
                        <OtpInput
                          value={input.value}
                          onChange={input.onChange}
                          numInputs={4}
                          renderSeparator={<span></span>}
                          shouldAutoFocus
                          inputType="number"
                          renderInput={(props) => (
                            <input
                              {...props}
                              style={customInputStyle}
                              className="text-center"
                              onWheel={(
                                e: React.WheelEvent<HTMLInputElement>
                              ) => e.currentTarget.blur()}
                            />
                          )}
                        />
                        {meta.touched && meta.error && (
                          <small className="text-red-600">{meta.error}</small>
                        )}
                      </div>
                    )}
                  />

                  <p>00:57s</p>
                  <button
                    className="auth-btn w-full mt-3 justify-center"
                    type="submit"
                    disabled={submitting || isLoadingOtp}
                  >
                    {submitting || isLoadingOtp ? (
                      <ClipLoader size={20} />
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                  <div className=" flex pt-5">
                    <p className="bg-[#F7F7F7] rounded-[1rem] py-[2px] px-[calc(1rem/2)] text-sm font-bold">
                      I didn&apos;t receive a code
                    </p>
                  </div>
                </form>
              )}
            />
          </div>
        )}

        {createNewPswd && (
          <div className="flex justify-center flex-col max-w-[516px] w-full">
            <div className="flex-col flex pb-8 pt-10">
              <h2 className="auth-header font-sans">Create new password</h2>
              <p className="auth-title font-sans pt-3">
                Set a new password to continue
              </p>
            </div>

            <Form
              onSubmit={createNewPswdHandler}
              validate={validateFormPswdForm}
              render={({ handleSubmit, form, submitting, values }) => (
                <form onSubmit={handleSubmit}>
                  <Field name="newPassword">
                    {({ input, meta }) => (
                      <PasswordField
                        id="newPassword"
                        eyeState={eyeState.password}
                        toggleEye={() => toggleEye("password")}
                        placeholder="*******"
                        label="Password"
                        form={form as any}
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
                          <small className="icon-container">
                            {!meta.active && !pattern.test(input.value) ? (
                              ""
                            ) : pattern.test(input.value) ? (
                              <IoCheckmarkCircle
                                className="text-green-600"
                                size={20}
                              />
                            ) : (
                              <FaTimesCircle
                                className="text-red-600"
                                size={20}
                              />
                            )}
                          </small>
                        }
                      />
                    )}
                  </Field>

                  <Field name="confirmPassword">
                    {({ input, meta }) => (
                      <PasswordField
                        id="confirmPassword"
                        eyeState={eyeState.confirmPassword}
                        toggleEye={() => toggleEye("confirmPassword")}
                        placeholder="*******"
                        label="Confirm Password"
                        form={form as any}
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
                          <small className="icon-container">
                            {!meta.active ? (
                              ""
                            ) : input.value === values.newPassword ? (
                              <IoCheckmarkCircle
                                className="text-green-600"
                                size={20}
                              />
                            ) : (
                              <FaTimesCircle
                                className="text-red-600"
                                size={20}
                              />
                            )}
                          </small>
                        }
                      />
                    )}
                  </Field>

                  <div
                    id="pwdnote"
                    className={
                      pwdFocus && !validPwd ? "instructions" : "offscreen"
                    }
                  >
                    <h5 className="text-[#979DA3] ">
                      YOUR PASSWORD MUST CONTAIN
                    </h5>
                    <ul className="text-[#979DA3] mt-3">
                      <li className="flex mb-3 items-center gap-2">
                        <ValidatePwdIcon
                          color={
                            values.newPassword?.length >= 8
                              ? "#2ECC71"
                              : "#E66767"
                          }
                        />
                        Between 8 and 20 characters
                      </li>
                      <li className="flex mb-3 items-center gap-2">
                        <ValidatePwdIcon
                          color={
                            /[A-Z]/.test(values.newPassword)
                              ? "#2ECC71"
                              : "#E66767"
                          }
                        />
                        1 upper case letter
                      </li>
                      <li className="flex mb-3 items-center gap-2">
                        <ValidatePwdIcon
                          color={
                            /\d/.test(values.newPassword)
                              ? "#2ECC71"
                              : "#E66767"
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

                  <button
                    className="auth-btn w-full mt-3 justify-center"
                    type="submit"
                    disabled={submitting || isReset}
                  >
                    {submitting || isLoadingOtp ? (
                      <ClipLoader size={20} />
                    ) : (
                      "Reset Password"
                    )}
                  </button>

                  {/* <button
                    className="auth-btn w-full justify-center mt-5"
                    type="submit"
                    disabled={submitting || !validMatch}
                  >
                    {submitting ? <ClipLoader size={20} /> : "Reset Password"}
                  </button> */}
                </form>
              )}
            />
          </div>
        )}

        {loading && <StateLoader goto={"/login"} />}
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
