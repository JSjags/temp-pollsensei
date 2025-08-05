"use client";
import { dark_theme_logo, pollsensei_new_logo } from "@/assets/images";
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
import { PlaceholderRightSide } from "@/components/reusable/coming-soon";

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
      router.push(`/verify-email${ed ? `?ed=${ed}` : ""}`);
    } catch (err: any) {
      toast.error(
        typeof err?.data?.message === "string"
          ? err?.data?.message
          : err?.data &&
            typeof err?.data === "string" &&
            err?.data.trim() !== ""
          ? JSON.parse(err?.data)?.message
          : err.message,
        {
          toastId: "api-error",
        }
      );
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
        toast.success(
          "Registration successful, please continue with same Google account"
        );
        // router.push("/verify-email");
        router.push("/login");
      } catch (err: any) {
        toast.error(
          typeof err?.data?.message === "string"
            ? err?.data?.message
            : JSON.parse(err?.data)?.message || err.message,
          {
            toastId: "api-error",
          }
        );
      }
    },
    onError: (err) => {
      console.error(error);
    },
    flow: "implicit",
  });

  const facebookSignUp = async () => {
    try {
      await facebookRegister({
        code: "EAAqHE480eNQBO01LHQi2UVuVsM70hdqIztRyMEOjZAphhhb8litk6x0ieDNHHFdvIDFopfgdVmY41fnnQZCm3bianzwKaZCvl0MXE0jVyFBY9eVwuFSa6wZBZAu4EdZCqM4gNwZA8MLoiT65S0neVPwL5xbPvgTu1EcFHAOO0xfXueJgs5zogrnrEcmyOopAwIUM4iMHdTKX9R0uezvKwZDZD",
      }).unwrap();
      toast.success("Register success");
    } catch (err: any) {
      toast.error(err?.data?.message || err.message, {
        toastId: "api-error",
      });
    }
  };

  if (user) {
    return null;
  }

  return (
    <section className="min-h-screen flex flex-col md:flex-row max-h-screen">
      {locationLoading ? (
        <>
          {/* Left Side Skeleton */}
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-4 md:px-8 py-6 md:py-0">
            <div className="flex flex-col w-full max-w-md mx-auto animate-pulse">
              <div className="h-8 w-32 bg-gray-200 rounded mb-8" />
              <div className="h-8 w-2/3 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-1/2 bg-gray-200 rounded mb-6" />
              <div className="h-10 w-3/4 bg-gray-200 rounded-full mb-4" />
              <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="mx-3 text-gray-300">Or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="h-10 w-full bg-gray-200 rounded mb-4" />
              <div className="h-10 w-full bg-gray-200 rounded mb-4" />
              <div className="h-10 w-full bg-gray-200 rounded mb-4" />
              <div className="h-6 w-2/3 bg-gray-200 rounded mb-4" />
              <div className="h-10 w-full bg-gray-200 rounded mb-4" />
              <div className="h-4 w-1/2 bg-gray-200 rounded mt-6 mx-auto" />
            </div>
          </div>
          {/* Right Side Skeleton */}
          <div className="hidden md:flex md:w-1/2 h-full items-center justify-center bg-gray-50 border-l border-gray-200">
            <div className="w-3/4 h-3/4 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </>
      ) : (
        <div className="flex flex-row h-screen w-full">
          {/* Left Side: Registration Form */}
          <div className="w-full md:w-1/2 flex flex-col items-center px-4 md:px-8 py-6 overflow-y-scroll">
            <div className="flex flex-col w-full max-w-md mx-auto">
              <div className="flex flex-col items-start mb-8">
                <Link href="/">
                  <Image
                    src={pollsensei_new_logo}
                    alt="Logo"
                    width={120}
                    height={32}
                  />
                </Link>
              </div>
              <h2 className="text-3xl font-semibold text-start mb-2">
                Welcome to PollSensei
              </h2>
              <p className="text-start text-gray-500 mb-6">
                The Best tool for your End-to-End Survey Solution
              </p>
              <button
                type="button"
                onClick={() => googleSignUp()}
                className="flex items-center justify-center w-fit py-2 px-4 mb-4 bg-[#9344BA1A] rounded-full hover:bg-[#9344BA2A] transition"
              >
                <Image
                  src={google}
                  alt="Google"
                  width={32}
                  height={32}
                  className="mr-2"
                />
                <span className="text-gray-700 font-medium text-base">
                  Continue with Google
                </span>
              </button>
              <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="mx-3 text-gray-400">Or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <Form
                onSubmit={onSubmit}
                validate={validateForm}
                render={({ handleSubmit, form, submitting, values }) => (
                  <form onSubmit={handleSubmit} className="w-full space-y-4">
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
                          eye={null}
                        />
                      )}
                    </Field>
                    <div className="flex items-center gap-2">
                      <Field name="terms" type="checkbox">
                        {({ input, meta }) => (
                          <>
                            <input
                              {...input}
                              type="checkbox"
                              id="terms"
                              className="accent-purple-600"
                            />
                            <label htmlFor="terms" className="ml-2 text-sm">
                              I agree with{" "}
                              <Link
                                href="/terms-of-service"
                                className="text-primary underline"
                                target="_blank"
                              >
                                Terms of Use
                              </Link>{" "}
                              and{" "}
                              <Link
                                href="/privacy-policy"
                                className="text-primary underline"
                                target="_blank"
                              >
                                Privacy Policy
                              </Link>
                            </label>
                            {meta.error && meta.touched && (
                              <span className="text-red-600 text-xs ml-2">
                                {meta.error}
                              </span>
                            )}
                          </>
                        )}
                      </Field>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white rounded-lg font-semibold hover:opacity-90 transition"
                      disabled={submitting || isLoading}
                    >
                      {submitting || isLoading ? (
                        <ClipLoader size={20} color="white" />
                      ) : (
                        "Sign Up"
                      )}
                    </button>
                  </form>
                )}
              />
              <div className="flex justify-center mt-6">
                <Link
                  href="/login"
                  className="text-primary px-3 text-sm hover:underline bg-[#F7F7F7] rounded-full"
                >
                  Already have an account? Login
                </Link>
              </div>
            </div>
          </div>
          {/* Right Side: Placeholder */}
          <div className="hidden md:flex md:w-1/2 h-full py-4 pr-4">
            <PlaceholderRightSide
              slides={[
                <div
                  key="slide1"
                  className="flex flex-col items-center justify-center h-full w-full"
                >
                  <p className="text-3xl font-bold mb-2 text-white text-center">
                    Create your Survey in Seconds
                  </p>
                  <p className="text-white text-center w-[80%] text-lg">
                    Easily design surveys using our advanced tools. Say goodbye
                    to time-consuming survey creation, and let PollSensei handle
                    it for you.
                  </p>
                  <Image
                    src="/auth/slide-1.svg"
                    alt="Slide 1"
                    width={320}
                    height={320}
                    className="w-[100%]"
                  />
                </div>,
                <div
                  key="slide2"
                  className="flex flex-col items-center justify-center h-full w-full"
                >
                  <p className="text-3xl font-bold mb-2 text-white text-center">
                    Analyse your Survey in Seconds
                  </p>
                  <p className="text-white text-center w-[80%] text-lg mt-4">
                    Imagine getting meaningful insights without endless hours of
                    analysis. PollSensei offers this and more.
                  </p>
                  <Image
                    src="/auth/slide-2.svg"
                    alt="Slide 2"
                    width={320}
                    height={320}
                    className="w-[100%] mt-12"
                  />
                </div>,
                <div
                  key="slide3"
                  className="flex flex-col items-center justify-center h-full w-full"
                >
                  <p className="text-3xl font-bold mb-2 text-white text-center">
                    Receive survey report
                  </p>
                  <p className="text-white text-center w-[80%] text-lg mt-4">
                    Our superpowered reporting tool takes the guesswork out of
                    analysis, highlighting key trends and actionable insights so
                    you can make smarter decisions.
                  </p>
                  <Image
                    src="/auth/slide-3.svg"
                    alt="Slide 3"
                    width={320}
                    height={320}
                    className="w-[100%] mt-12"
                  />
                </div>,
              ]}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default RegisterPage;
