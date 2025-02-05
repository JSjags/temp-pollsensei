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
import { motion, AnimatePresence } from "framer-motion";

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

// Validation constraints remain the same...
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
  borderRadius: "8px",
  border: "2px solid #9D50BB",
  transition: "all 0.2s ease",
  background: "rgba(157, 80, 187, 0.05)",
};

const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3 },
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
    } catch (err: any) {
      toast.error("Failed " + err?.data?.message || err.message);
    }
  };

  const validateForm = (values: any) => {
    return validate(values, constraints) || {};
  };

  const onSubmitOtp = async (values: { code: string }) => {
    try {
      const otpData = { ...values, code: parseInt(values.code, 10), email };
      await verifyOTP(otpData).unwrap();
      toast.success("OTP verified successfully");
      setOtpInput(false);
      setCreateNewPswd(true);
    } catch (err: any) {
      toast.error("Failed " + err?.data?.message || err.message);
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
      await resetPassword(reset_data).unwrap();
      toast.success("Password reset was successful");
      setCreateNewPswd(false);
      setLoading(true);
    } catch (err: any) {
      toast.error("Failed " + err?.data?.message || err.message);
    }
  };

  const validateFormPswdForm = (values: any) => {
    return validate(values, newPswdConstraints) || {};
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-purple-50 to-white"
    >
      {/* Header for smaller screens */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="md:hidden auth-bg w-full flex items-center justify-center p-4 bg-gradient-to-r from-purple-600 to-pink-500"
      >
        <div className="flex items-center gap-3">
          <Image
            src={logo}
            alt=""
            className="h-8 animate-pulse"
            width={32}
            height={32}
          />
          <h1 className="auth-head text-white">PollSensei</h1>
        </div>
      </motion.div>

      {/* Content for larger screens */}
      <motion.div
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex auth-bg w-full flex-col justify-center items-center bg-gradient-to-br from-purple-600 to-pink-500"
      >
        <div className="text-white">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center justify-center gap-3 pb-10"
          >
            <Image
              src={logo}
              alt="Logo"
              width={32}
              height={32}
              className="animate-pulse"
            />
            <h1 className="auth-head">PollSensei</h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Image
              src={steps}
              alt="Steps"
              className="pb-4 w-full max-w-[400px] h-auto hover:scale-105 transition-transform duration-300"
              width={300}
              height={200}
            />
          </motion.div>

          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="auth-heading pb-8 text-white"
          >
            Create End-to-End <br /> Surveys with our AI tool
          </motion.h3>

          <motion.h5
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="auth-subtitle text-white/80"
          >
            PollSensei helps you to Create suggest questions, <br /> formats,
            methodologies
          </motion.h5>
        </div>
      </motion.div>

      <div className="w-full flex flex-col justify-center items-center px-5 py-10">
        <AnimatePresence mode="wait">
          {emailInput && (
            <motion.div
              {...pageTransition}
              className="flex justify-center flex-col max-w-[516px] w-full"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-col flex pb-10 pt-10"
              >
                <h2 className="auth-header font-sans text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  Forgot Password?
                </h2>
                <p className="auth-title font-sans pt-3 text-gray-600">
                  Not to worry. We will help you recover it
                </p>
              </motion.div>

              <Form
                onSubmit={onSubmit}
                validate={validateForm}
                render={({ handleSubmit, form, submitting }) => (
                  <motion.form
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
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

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="auth-btn w-full justify-center bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      type="submit"
                      disabled={submitting || isLoading}
                    >
                      {submitting || isLoading ? (
                        <ClipLoader size={20} color="white" />
                      ) : (
                        "Reset Password"
                      )}
                    </motion.button>
                  </motion.form>
                )}
              />
            </motion.div>
          )}

          {otpInput && (
            <motion.div
              {...pageTransition}
              className="flex justify-center flex-col max-w-[516px] w-full"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-col flex pb-8 pt-10"
              >
                <h2 className="auth-header font-sans text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  Verify that it is you
                </h2>
                <p className="auth-title font-sans pt-3 text-gray-600">
                  We sent a code to your email
                </p>
              </motion.div>

              <Form
                onSubmit={onSubmitOtp}
                validate={validateOTPForm}
                render={({ handleSubmit, submitting }) => (
                  <motion.form
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <Field name="code">
                      {({ input, meta }) => (
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
                                className="text-center focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                                onWheel={(e) => e.currentTarget.blur()}
                              />
                            )}
                          />
                          {meta.touched && meta.error && (
                            <motion.small
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-red-600"
                            >
                              {meta.error}
                            </motion.small>
                          )}
                        </div>
                      )}
                    </Field>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-gray-600"
                    >
                      00:57s
                    </motion.p>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="auth-btn w-full mt-3 justify-center bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      type="submit"
                      disabled={submitting || isLoadingOtp}
                    >
                      {submitting || isLoadingOtp ? (
                        <ClipLoader size={20} color="white" />
                      ) : (
                        "Verify Code"
                      )}
                    </motion.button>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="flex pt-5"
                    >
                      <p className="bg-[#F7F7F7] rounded-[1rem] py-[2px] px-[calc(1rem/2)] text-sm font-bold cursor-pointer hover:bg-[#F0F0F0] transition-colors">
                        I didn&apos;t receive a code
                      </p>
                    </motion.div>
                  </motion.form>
                )}
              />
            </motion.div>
          )}

          {createNewPswd && (
            <motion.div
              {...pageTransition}
              className="flex justify-center flex-col max-w-[516px] w-full"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-col flex pb-8 pt-10"
              >
                <h2 className="auth-header font-sans text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  Create new password
                </h2>
                <p className="auth-title font-sans pt-3 text-gray-600">
                  Set a new password to continue
                </p>
              </motion.div>

              <Form
                onSubmit={createNewPswdHandler}
                validate={validateFormPswdForm}
                render={({ handleSubmit, form, submitting, values }) => (
                  <motion.form
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
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
                            <motion.small
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="icon-container"
                            >
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
                            </motion.small>
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
                            <motion.small
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="icon-container"
                            >
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
                            </motion.small>
                          }
                        />
                      )}
                    </Field>

                    <AnimatePresence>
                      {pwdFocus && !validPwd && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-gray-50 p-4 rounded-lg"
                        >
                          <h5 className="text-gray-600 font-semibold">
                            YOUR PASSWORD MUST CONTAIN
                          </h5>
                          <ul className="text-gray-600 mt-3 space-y-2">
                            <motion.li
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              className="flex items-center gap-2"
                            >
                              <ValidatePwdIcon
                                color={
                                  values.newPassword?.length >= 8
                                    ? "#2ECC71"
                                    : "#E66767"
                                }
                              />
                              Between 8 and 20 characters
                            </motion.li>
                            <motion.li
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.1 }}
                              className="flex items-center gap-2"
                            >
                              <ValidatePwdIcon
                                color={
                                  /[A-Z]/.test(values.newPassword)
                                    ? "#2ECC71"
                                    : "#E66767"
                                }
                              />
                              1 upper case letter
                            </motion.li>
                            <motion.li
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.2 }}
                              className="flex items-center gap-2"
                            >
                              <ValidatePwdIcon
                                color={
                                  /\d/.test(values.newPassword)
                                    ? "#2ECC71"
                                    : "#E66767"
                                }
                              />
                              1 or more numbers
                            </motion.li>
                            <motion.li
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              className="flex items-center gap-2"
                            >
                              <ValidatePwdIcon
                                color={
                                  /[@#&$!]/.test(values.newPassword)
                                    ? "#2ECC71"
                                    : "#E66767"
                                }
                              />
                              1 or more special characters
                            </motion.li>
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="auth-btn w-full mt-3 justify-center bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      type="submit"
                      disabled={submitting || isReset}
                    >
                      {submitting || isReset ? (
                        <ClipLoader size={20} color="white" />
                      ) : (
                        "Reset Password"
                      )}
                    </motion.button>
                  </motion.form>
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {loading && <StateLoader goto={"/login"} />}
      </div>
    </motion.section>
  );
};

export default ForgotPasswordPage;
