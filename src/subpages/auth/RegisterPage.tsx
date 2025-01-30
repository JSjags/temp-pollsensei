"use client";
import { dark_theme_logo } from "@/assets/images";
import Input from "@/components/ui/Input";
import { useGoogleLogin } from "@react-oauth/google";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Field, Form } from "react-final-form";
import { FaTimesCircle } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import validate from "validate.js";
import chat from "../../assets/auth/chat.svg";
import google from "../../assets/auth/goggle.svg";
import logo from "../../assets/auth/logo.svg";
import steps from "../../assets/auth/steps2.svg";
import PasswordField from "../../components/ui/PasswordField";
import {
  useFacebookRegisterMutation,
  useGooleRegisterMutation,
  useRegisterUserMutation,
} from "../../services/user.service";
import { useGeoLocation } from "../settings/subscription/PricingCards";

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
    // format: {
    //   pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
    //   message:
    //     "^Password must be between 8 and 20 characters long, contain at least one uppercase letter, one number, and one special character",
    // },
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

const Client_Id = process.env.VITE_NEXT_GOOGLE_REG_CLIENT_ID;
console.log(Client_Id);

const RegisterPage = () => {
  const router = useRouter();
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
    // Track the button click with Mixpanel
    try {
      await registerUser({
        ...values,
        country: locationData?.isSuccess ? locationData?.country : "null",
        ...(refCode ? { referral_code: refCode } : {}),
      }).unwrap();
      toast.success(
        "User registered successfully, check your email to continue"
      );
      // Navigate to login page
      router.push(`/login?${ed && `ed=${ed}`}`);
      console.log("User registered successfully");
      // mixpanel.track("Sign-Up Clicked", {
      //   timestamp: new Date().toISOString(), // Optional: Track time
      // });
    } catch (err: any) {
      toast.error(
        "Failed to register user " + (err?.data?.message || err.message)
      );
      console.error("Failed to register user", err);
      console.error("Error tracking event:", err);
    }
  };

  const validateForm = (values: any) => {
    return validate(values, constraints) || {};
  };

  // const googleSignUp = useGoogleLogin({
  //   onSuccess: async (response) => {
  //     const authCode = response.code;
  //     const requestData = {
  //       code: authCode,
  //     };

  //     try {
  //       await gooleRegister(requestData).unwrap();
  //       toast.success("Register success");
  //     } catch (err: any) {
  //       toast.error(
  //         "Failed to register user " + (err?.data?.message || err.message)
  //       );
  //       console.error("Failed to sign up user", err);
  //     }
  //   },
  //   onError: () => console.log("Google Sign-In Failed"),
  //   flow: "auth-code",
  // });

  const googleSignUp = useGoogleLogin({
    onSuccess: async (response) => {
      const accessToken = response.access_token; // Directly get the access token

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
    flow: "implicit", // Use the 'implicit' flow
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

  return (
    <section className="min-h-screen flex flex-col md:flex-row max-h-screen">
      {locationLoading ? (
        <>
          <div className="md:w-1/2 hidden md:flex">
            <div className="w-full h-full bg-gray-100 animate-pulse" />
          </div>
          <div className="w-full md:w-1/2 p-8">
            <div className="max-w-[516px] mx-auto space-y-6">
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>

              <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded animate-pulse" />
                <div className="h-12 bg-gray-200 rounded animate-pulse" />
                <div className="h-12 bg-gray-200 rounded animate-pulse" />
                <div className="h-12 bg-gray-200 rounded animate-pulse" />
              </div>

              <div className="h-10 bg-gray-200 rounded animate-pulse" />

              <div className="flex justify-center">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-48" />
              </div>

              <div className="flex items-center gap-4">
                <div className="h-px bg-gray-200 flex-1" />
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-px bg-gray-200 flex-1" />
              </div>

              <div className="flex justify-center">
                <div className="h-14 bg-gray-200 rounded-full animate-pulse w-64" />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="auth-bg md:hidden flex items-center justify-center p-4">
            <div className="flex items-center justify-center gap-3">
              <Image src={logo} alt="Logo" width={32} height={32} />
              <h1 className="auth-head">PollSensei</h1>
            </div>
          </div>
          <div className="auth-bg hidden md:flex md:w-1/2 flex-col justify-center items-center p-8">
            <div className="flex flex-col items-center max-w-md w-full">
              <div className="flex items-center justify-center gap-3 pb-10">
                <Image
                  src={dark_theme_logo}
                  alt="Logo"
                  width={200}
                  height={32}
                />
              </div>

              <Image
                src={steps}
                alt="Steps"
                className="pb-4 w-full max-w-[400px] h-auto"
                width={300}
                height={200}
              />

              <h3 className="auth-heading pb-5 text-center">
                Create End-to-End <br /> Surveys with our AI tool
              </h3>
              <h5 className="auth-subtitle text-center">
                PollSensei helps you to Create suggest questions, <br />{" "}
                formats, methodologies
              </h5>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col items-center px-4 md:px-8 py-6 md:py-0 max-h-screen overflow-scroll">
            <div className="flex justify-center flex-col max-w-[516px] w-full">
              <div className="flex-col flex pb-6 md:pb-8 pt-6 md:pt-10">
                <h2 className="auth-header font-sans text-center md:text-left">
                  Welcome to PollSensei
                </h2>
                <p className="auth-title font-sans pt-3 text-center md:text-left">
                  The Best tool for your End-to-End Survey Solution
                </p>
              </div>

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
                    <div className="flex justify-start items-center pt-3 gap-2">
                      <Field name="terms" type="checkbox">
                        {({ input, meta }) => (
                          <div>
                            <input {...input} type="checkbox" id="terms" />
                            <label htmlFor="terms" className="ml-2">
                              I agree to the{" "}
                              <Link
                                className="text-blue-700 underline"
                                href={"/terms-of-service"}
                              >
                                terms and conditions
                              </Link>
                            </label>
                            {meta.error && meta.touched && (
                              <span className="text-red-500">{meta.error}</span>
                            )}
                          </div>
                        )}
                      </Field>
                    </div>

                    <button
                      className="auth-btn w-full justify-center mt-4"
                      type="submit"
                      disabled={submitting || isLoading}
                    >
                      {submitting || isLoading ? (
                        <ClipLoader size={20} />
                      ) : (
                        "Sign Up"
                      )}
                    </button>

                    {isSuccess && (
                      <p className="text-green-600 mt-2">
                        User registered successfully!
                      </p>
                    )}
                    {isError && (
                      <p className="text-red-600 mt-2">
                        Failed to register user:{" "}
                        {error && typeof error === "object" && "data" in error
                          ? (error.data as { message?: string })?.message
                          : error instanceof Error
                          ? error.message
                          : "An unknown error occurred"}
                      </p>
                    )}
                  </form>
                )}
              />

              <div className="flex justify-center pt-5">
                <p className="bg-[#F7F7F7] rounded-[1rem] py-[2px] px-[calc(1rem/2)] text-sm">
                  Already have an account? <Link href="/login">Login</Link>
                </p>
              </div>

              <div className="flex gap-3 md:gap-5 items-center pt-5">
                <div className="border flex-grow border-[#E5EFFF]"></div>
                <div className="auth-divider whitespace-nowrap">
                  Or <span className="hidden md:inline">Continue with</span>
                </div>
                <div className="border flex-grow border-[#E5EFFF]"></div>
              </div>

              <div className="social-icons flex justify-center items-center gap-4 pt-5 cursor-pointer">
                <span
                  onClick={() => {
                    try {
                      googleSignUp();
                    } catch (err) {
                      console.error("Error during Google sign up:", err);
                      toast.error("Failed to sign up with Google");
                      console.error("Error tracking event:", err);
                    }
                  }}
                  className="flex justify-between items-center gap-2 border pr-2 rounded-full"
                >
                  <Image
                    src={google}
                    alt="Google"
                    width={56}
                    height={56}
                    className="size-14"
                  />
                  <span>Sign in with your Google account</span>
                </span>
              </div>

              <div className="flex justify-end items-center mt-4">
                <p className="mr-2">Need Help?</p>
                <Image
                  src={chat}
                  alt="Chat"
                  className="object-cover size-20"
                  width={24}
                  height={24}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default RegisterPage;
