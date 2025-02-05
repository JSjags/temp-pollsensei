"use client";
import { dark_theme_logo } from "@/assets/images";
import Input from "@/components/ui/Input";
import { useGoogleLogin } from "@react-oauth/google";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Field, Form } from "react-final-form";
import { FaTimesCircle } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";
import { ClipLoader } from "react-spinners";
import validate from "validate.js";
import google from "../../assets/auth/goggle.svg";
import facebook from "../../assets/auth/facebook.svg";
import chat from "../../assets/auth/chat.svg";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/auth/logo.svg";
import steps from "../../assets/auth/steps2.svg";
import PasswordField from "../../components/ui/PasswordField";
import mixpanel from "mixpanel-browser";
import {
  useFacebookRegisterMutation,
  useGooleRegisterMutation,
  useRegisterUserMutation,
} from "../../services/user.service";
import { useGeoLocation } from "../settings/subscription/PricingCards";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const constraints = {
  name: {
    presence: true,
  },
  email: {
    presence: true,
    email: true,
  },
  password: {
    presence: true,
    length: {
      minimum: 8,
    },
  },
  confirmPassword: {
    presence: true,
    equality: {
      attribute: "password",
      message: "^Passwords do not match",
    },
  },
  terms: {
    presence: {
      message: "must be accepted",
    },
    inclusion: {
      within: [true],
      message: "^must be accepted",
    },
  },
};

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const Client_Id = process.env.VITE_NEXT_GOOGLE_REG_CLIENT_ID;

const RegisterPage = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const searchParams = useSearchParams();
  const refValue = searchParams.get("ref");
  const [refCode, setRefCode] = useState(refValue ?? "");
  const [registerUser, { isSuccess, isError, error, isLoading }] =
    useRegisterUserMutation();

  const [gooleRegister, { data: register, error: registerError }] =
    useGooleRegisterMutation();
  const [facebookRegister] = useFacebookRegisterMutation();

  const [eyeState, setEyeState] = useState({
    password: false,
    confirmPassword: false,
  });
  const [pwdFocus, setPwdFocus] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const ed = searchParams.get("ed");

  const pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

  const toggleEye = (field: "password" | "confirmPassword") => {
    setEyeState((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const {
    data: locationData,
    isLoading: locationLoading,
    isError: locationError,
  } = useGeoLocation();

  const onSubmit = async (values: any) => {
    try {
      await registerUser({
        ...values,
        country: locationData?.isSuccess ? locationData?.country : "null",
        ...(refCode ? { referral_code: refCode } : {}),
      }).unwrap();
      toast.success(
        "User registered successfully, check your email to continue"
      );
      router.push(`/login?${ed && `ed=${ed}`}`);
    } catch (err: any) {
      toast.error(
        "Failed to register user " + (err?.data?.message || err.message)
      );
      console.error("Failed to register user", err);
    }
  };

  const validateForm = (values: any) => {
    return validate(values, constraints) || {};
  };

  const googleSignUp = useGoogleLogin({
    onSuccess: async (response) => {
      const accessToken = response.access_token;

      try {
        await gooleRegister({
          code: accessToken,
          referral_code: refCode,
        }).unwrap();
        toast.success("Register success");
        router.push("/login");
      } catch (err: any) {
        toast.error(
          "Failed to register user " + (err?.data?.message || err.message)
        );
        console.error("Failed to sign up user", err);
      }
    },
    onError: () => console.log("Google Sign-In Failed"),
    flow: "implicit",
  });

  const facebookSignUp = async () => {
    try {
      await facebookRegister({
        code: "EAAqHE480eNQBO01LHQi2UVuVsM70hdqIztRyMEOjZAphhhb8litk6x0ieDNHHFdvIDFopfgdVmY41fnnQZCm3bianzwKaZCvl0MXE0jVyFBY9eVwuFSa6wZBZAu4EdZCqM4gNwZA8MLoiT65S0neVPwL5xbPvgTu1EcFHAOO0xfXueJgs5zogrnrEcmyOopAwIUM4iMHdTKX9R0uezvKwZDZD",
      }).unwrap();
      toast.success("Register success");
    } catch (err: any) {
      toast.error(
        "Failed to register user " + (err?.data?.message || err.message)
      );
      console.error("Failed to sign up user", err);
    }
  };

  if (user) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex flex-col md:flex-row max-h-screen"
      >
        {locationLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col md:flex-row w-full"
          >
            <div className="md:w-1/2 hidden md:flex">
              <div className="w-full h-full bg-gray-100 animate-pulse" />
            </div>
            <div className="w-full md:w-1/2 p-8">
              <div className="max-w-[516px] mx-auto space-y-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="h-12 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  <div className="h-14 bg-gray-200 rounded animate-pulse" />
                  <div className="h-14 bg-gray-200 rounded animate-pulse" />
                  <div className="h-14 bg-gray-200 rounded animate-pulse" />
                  <div className="h-14 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-48" />
                  <div className="h-12 bg-gray-200 rounded animate-pulse" />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-6"
                >
                  <div className="h-10 bg-gray-200 rounded animate-pulse w-64 mx-auto" />
                  <div className="flex items-center gap-4">
                    <div className="h-px bg-gray-200 flex-1" />
                    <div className="h-4 bg-gray-200 rounded w-20" />
                    <div className="h-px bg-gray-200 flex-1" />
                  </div>
                  <div className="h-14 bg-gray-200 rounded-full animate-pulse w-72 mx-auto" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="auth-bg md:hidden flex items-center justify-center p-4"
            >
              <div className="flex items-center justify-center gap-3">
                <Image src={logo} alt="Logo" width={32} height={32} />
                <h1 className="auth-head">PollSensei</h1>
              </div>
            </motion.div>
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="auth-bg hidden md:flex md:w-1/2 flex-col justify-center items-center p-8"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center max-w-md w-full"
              >
                <div className="flex items-center justify-center gap-3 pb-10">
                  <Image
                    src={dark_theme_logo}
                    alt="Logo"
                    width={200}
                    height={32}
                  />
                </div>

                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Image
                    src={steps}
                    alt="Steps"
                    className="pb-4 w-full max-w-[400px] h-auto"
                    width={300}
                    height={200}
                  />
                </motion.div>

                <motion.h3
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="auth-heading pb-5 text-center"
                >
                  Create End-to-End <br /> Surveys with our AI tool
                </motion.h3>
                <motion.h5
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="auth-subtitle text-center"
                >
                  PollSensei helps you to Create suggest questions, <br />{" "}
                  formats, methodologies
                </motion.h5>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full md:w-1/2 flex flex-col items-center px-4 md:px-8 py-6 md:py-0 max-h-screen overflow-scroll"
            >
              <div className="flex justify-center flex-col max-w-[516px] w-full">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex-col flex pb-6 md:pb-8 pt-6 md:pt-10"
                >
                  <h2 className="auth-header font-sans text-center md:text-left">
                    Welcome to PollSensei
                  </h2>
                  <p className="auth-title font-sans pt-3 text-center md:text-left">
                    The Best tool for your End-to-End Survey Solution
                  </p>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Form
                    onSubmit={onSubmit}
                    validate={validateForm}
                    render={({ handleSubmit, form, submitting, values }) => (
                      <form onSubmit={handleSubmit} className="w-full">
                        <Field name="name">
                          {({ input, meta }) => (
                            <Input
                              label="Name"
                              type="text"
                              placeholder="Enter your Name"
                              form={form as any}
                              {...input}
                            />
                          )}
                        </Field>

                        <Field name="email">
                          {({ input, meta }) => (
                            <Input
                              label="Email"
                              type="email"
                              placeholder="Enter your Email"
                              form={form as any}
                              {...input}
                            />
                          )}
                        </Field>

                        <Field name="password">
                          {({ input, meta }) => (
                            <PasswordField
                              id="password"
                              eyeState={eyeState.password}
                              toggleEye={() => toggleEye("password")}
                              placeholder="*******"
                              label="Password"
                              form={form}
                              {...input}
                              onFocus={() => setPwdFocus(true)}
                              onBlur={() => setPwdFocus(false)}
                              eye={
                                (
                                  <small className="icon-container">
                                    {!meta.active &&
                                    !pattern.test(input.value) ? (
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
                                ) as any
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
                              form={form}
                              {...input}
                              onFocus={() => setMatchFocus(true)}
                              onBlur={() => setMatchFocus(false)}
                              eye={
                                (
                                  <small className="icon-container">
                                    {!meta.active ? (
                                      ""
                                    ) : input.value === values.password ? (
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
                                ) as any
                              }
                            />
                          )}
                        </Field>

                        <div className="pt-3">
                          <label className="auth-label font-sans pb-2">
                            Referral Code
                          </label>
                          <input
                            value={refCode}
                            onChange={(e) => setRefCode(e?.target?.value)}
                            type="text"
                            className="auth-input w-full  focus:outline-purple-800 focus:ring-focus focus:ring-1 font-sans border border-border text-foreground placeholder:text-foreground/40"
                          />
                        </div>
                        <motion.div
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.7 }}
                          className="flex justify-start items-center pt-3 gap-2"
                        >
                          <Field name="terms" type="checkbox">
                            {({ input, meta }) => (
                              <div>
                                <input {...input} type="checkbox" id="terms" />
                                <label htmlFor="terms" className="ml-2">
                                  I agree to the{" "}
                                  <Link
                                    className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] bg-clip-text text-transparent hover:from-[#5B03B2] hover:to-[#9D50BB] font-semibold"
                                    href={"/terms-of-service"}
                                  >
                                    terms and conditions
                                  </Link>
                                </label>
                                {meta.error && meta.touched && (
                                  <p className="text-red-600 text-[13px]">
                                    {meta.error}
                                  </p>
                                )}
                              </div>
                            )}
                          </Field>
                        </motion.div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="auth-btn w-full justify-center mt-4"
                          type="submit"
                          disabled={submitting || isLoading}
                        >
                          {submitting || isLoading ? (
                            <ClipLoader size={20} />
                          ) : (
                            "Sign Up"
                          )}
                        </motion.button>

                        <AnimatePresence>
                          {isSuccess && (
                            <motion.p
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-green-600 mt-2"
                            >
                              User registered successfully!
                            </motion.p>
                          )}
                          {isError && (
                            <motion.p
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-red-600 mt-2"
                            >
                              Failed to register user:{" "}
                              {error &&
                              typeof error === "object" &&
                              "data" in error
                                ? (error.data as { message?: string })?.message
                                : error instanceof Error
                                ? error.message
                                : "An unknown error occurred"}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </form>
                    )}
                  />
                </motion.div>

                <motion.div
                  variants={fadeIn}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.4 }}
                  className="flex justify-center pt-5"
                >
                  <p className="bg-white shadow-md rounded-[1rem] py-2 px-4 text-sm">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] bg-clip-text text-transparent hover:from-[#5B03B2] hover:to-[#9D50BB] font-semibold"
                    >
                      Login
                    </Link>
                  </p>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="flex gap-3 md:gap-5 items-center pt-5"
                >
                  <div className="border flex-grow border-[#E5EFFF]"></div>
                  <div className="auth-divider whitespace-nowrap">
                    Or <span className="hidden md:inline">Continue with</span>
                  </div>
                  <div className="border flex-grow border-[#E5EFFF]"></div>
                </motion.div>

                <motion.div
                  variants={fadeIn}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.6 }}
                  className="social-icons flex justify-center items-center gap-4 pt-5"
                >
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      try {
                        googleSignUp();
                        mixpanel.track("Google Sign-In Clicked", {
                          timestamp: new Date().toISOString(),
                        });
                      } catch (err) {
                        console.error("Error during Google sign up:", err);
                        toast.error("Failed to sign in with Google");
                      }
                    }}
                    className="flex justify-between items-center gap-2 border pr-4 rounded-full hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-white"
                  >
                    <Image
                      src={google}
                      alt="Google"
                      width={56}
                      height={56}
                      className="size-14"
                    />
                    <span className="text-gray-700">
                      Sign in with your Google account
                    </span>
                  </motion.span>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="flex justify-end items-center mt-4"
                >
                  <p className="mr-2">Need Help?</p>
                  <Image
                    src={chat}
                    alt="Chat"
                    className="object-cover size-20"
                    width={24}
                    height={24}
                  />
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </motion.section>
    </AnimatePresence>
  );
};

export default RegisterPage;
