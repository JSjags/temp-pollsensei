"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { Form, Field } from "react-final-form";
import validate from "validate.js";
import Link from "next/link";
import { ClipLoader } from "react-spinners";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../redux/slices/user.slice";
import { useEffect, useState } from "react";
import PasswordField from "../../components/ui/PasswordField";
import Input from "@/components/ui/Input";
import StateLoader2 from "@/components/common/StateLoader2";
import { useRouter, useSearchParams } from "next/navigation";
import { RootState } from "@/redux/store";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// Import images
import steps from "../../assets/auth/steps2.svg";
import google from "../../assets/auth/goggle.svg";
import chat from "../../assets/auth/chat.svg";
import { dark_theme_logo, pollsensei_new_logo } from "@/assets/images";
import axiosInstance from "@/lib/axios-instance";
import { useGoogleLoginMutation } from "@/services/user.service";
import { PlaceholderRightSide } from "@/components/reusable/coming-soon";

const constraints = {
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
};

export const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const user = useSelector((state: RootState) => state.user.user);
  const ed = searchParams.get("ed");

  const [loginState, setLoginState] = useState(true);
  const [state, setState] = useState(false);
  const [eyeState, setEyeState] = useState(false);
  const [googleLogin, { data: register, error: registerError }] =
    useGoogleLoginMutation();

  const loginMutation = useMutation({
    mutationFn: (values: { email: string; password: string }) => {
      return axiosInstance.post("/auth/login", values);
    },
    onSuccess: (response) => {
      dispatch(updateUser(response?.data));
      toast.success("Login successful");
      setState(true);
      setLoginState(false);
      if (ed) {
        if (ed === "2") {
          router.push("/surveys/edit-survey");
        } else if (ed === "3") {
          router.push("/surveys/manual-survey-create");
        }
      }
    },
    onError: (err: any) => {
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
    },
    retry: false,
  });

  const googleLoginMutation = useMutation({
    mutationFn: (code: string) => {
      return axios.post("/api/auth/google", { code });
    },
    onSuccess: (response) => {
      dispatch(updateUser(response.data.data));
      toast.success("Sign in success");
      if (ed) {
        if (ed === "2") {
          router.push("/surveys/edit-survey");
        } else if (ed === "3") {
          router.push("/surveys/manual-survey-create");
        }
      } else {
        router.push("/dashboard");
      }
    },
    onError: (error: any) => {
      toast.error(
        "Failed to register user " +
          (error?.response?.data?.message || error.message)
      );
    },
  });

  useEffect(() => {
    if (user) {
      if (ed) {
        if (ed === "2") {
          router.push("/surveys/edit-survey");
        } else if (ed === "3") {
          router.push("/surveys/manual-survey-create");
        }
      }
    }
  }, [user, router, ed]);

  const onSubmit = (values: { email: string; password: string }) => {
    loginMutation.mutate(values);
  };

  const validateForm = (values: any) => {
    return validate(values, constraints) || {};
  };

  const googleSignUp = useGoogleLogin({
    onSuccess: async (response) => {
      const accessToken = response.access_token; // Directly get the access token

      try {
        const userData = await googleLogin({ code: accessToken }).unwrap();
        toast.success("Sign in  success");
        dispatch(updateUser(userData.data));
        setState(true);
        setLoginState(false);
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

  if (user || state) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#F5F7FB] to-[#E3E6F3] relative"
      >
        {/* Left side: login form or content, with spinner at the top */}
        <div className="flex-1 flex flex-col justify-center items-center relative px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full md:w-1/2 flex flex-col justify-center items-center px-4 md:px-8 py-6 md:py-0"
            >
              <StateLoader2
                defaultGoto="/login"
                directRoute={
                  ed
                    ? ed === "2"
                      ? "/surveys/edit-survey"
                      : ed === "3"
                      ? "/surveys/manual-survey-create"
                      : undefined
                    : undefined
                }
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right side: PlaceholderRightSide for slides/new design */}
        <div className="hidden md:block md:w-1/2 h-full">
          <PlaceholderRightSide
            slides={[
              <div
                key="slide1"
                className="flex flex-col items-center justify-center h-full px-8"
              >
                <Image
                  src={steps}
                  alt="Steps"
                  className="w-full max-w-[400px] h-auto mb-6"
                  width={300}
                />
                <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                  Create Surveys Effortlessly
                </h2>
                <p className="text-gray-600 text-center">
                  Design, distribute, and analyze surveys with ease using
                  PollSensei's intuitive platform.
                </p>
              </div>,
              <div
                key="slide2"
                className="flex flex-col items-center justify-center h-full px-8"
              >
                <Image
                  src={pollsensei_new_logo}
                  alt="Logo"
                  className="w-24 h-24 mb-6"
                  width={96}
                  height={96}
                />
                <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                  Powerful Analytics
                </h2>
                <p className="text-gray-600 text-center">
                  Gain insights from your responses with real-time analytics and
                  beautiful visualizations.
                </p>
              </div>,
              <div
                key="slide3"
                className="flex flex-col items-center justify-center h-full px-8"
              >
                <Image
                  src={dark_theme_logo}
                  alt="Dark Theme Logo"
                  className="w-32 h-auto mb-6"
                  width={128}
                  height={32}
                />
                <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                  Secure & Reliable
                </h2>
                <p className="text-gray-600 text-center">
                  Your data is protected with industry-leading security and
                  privacy standards.
                </p>
              </div>,
            ]}
          />
        </div>
        <AnimatePresence mode="wait">
          <div className="md:hidden flex items-center justify-center p-4 bg-white shadow">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-3"
            >
              <Link href="/">
                <Image
                  src={pollsensei_new_logo}
                  alt="Logo"
                  width={100}
                  height={100}
                />
              </Link>
              <h1 className="auth-head text-white font-bold">PollSensei</h1>
            </motion.div>
          </div>

          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="auth-bg hidden md:flex md:w-1/2 flex-col justify-center items-center p-8 bg-gradient-to-br from-blue-600 to-blue-400"
          >
            <div className="flex flex-col items-center max-w-md w-full">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center gap-3 pb-10"
              >
                <Image
                  src={dark_theme_logo}
                  alt="Logo"
                  width={200}
                  height={32}
                  className="drop-shadow-lg"
                />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
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
                variants={fadeIn}
                initial="initial"
                animate="animate"
                className="auth-heading pb-5 text-center text-white text-3xl font-bold"
              >
                Create End-to-End <br /> Surveys with our AI tool
              </motion.h3>

              <motion.h5
                variants={fadeIn}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.4 }}
                className="auth-subtitle text-center text-white/90"
              >
                PollSensei helps you to Create suggest questions, <br />{" "}
                formats, methodologies
              </motion.h5>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full md:w-1/2 flex flex-col justify-center items-center px-4 md:px-8 py-6 md:py-0"
            >
              <StateLoader2
                defaultGoto="/login"
                directRoute={
                  ed
                    ? ed === "2"
                      ? "/surveys/edit-survey"
                      : ed === "3"
                      ? "/surveys/manual-survey-create"
                      : undefined
                    : undefined
                }
              />
            </motion.div>
          </AnimatePresence>
        </AnimatePresence>
      </motion.section>
    );
  }

  return (
    <section className="min-h-screen max-w-[1440px] mx-auto flex flex-col md:flex-row max-h-screen">
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
            Welcome back to PollSensei
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
            render={({ handleSubmit, form, submitting }) => (
              <form onSubmit={handleSubmit} className="w-full space-y-4">
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
                      eyeState={eyeState}
                      toggleEye={() => setEyeState((prev) => !prev)}
                      placeholder="*******"
                      label="Password"
                      form={form as any}
                      {...input}
                    />
                  )}
                </Field>
                <div className="py-3 font-bold text-right">
                  <Link
                    href="/forgot-password"
                    className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] bg-clip-text text-transparent hover:from-[#5B03B2] hover:to-[#9D50BB] transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white rounded-lg font-semibold hover:opacity-90 transition"
                  disabled={submitting || loginMutation.isPending}
                >
                  {submitting || loginMutation.isPending ? (
                    <ClipLoader size={20} color="white" />
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>
            )}
          />
          <div className="flex justify-center mt-6">
            <Link
              href="/register"
              className="text-primary px-3 text-sm hover:underline bg-[#F7F7F7] rounded-full"
            >
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </div>
      </div>
      {/* Right Side: Placeholder */}
      <div className="hidden md:flex md:w-1/2 h-screen py-4 pr-4">
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
                Easily design surveys using our advanced tools. Say goodbye to
                time-consuming survey creation, and let PollSensei handle it for
                you.
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
                analysis, highlighting key trends and actionable insights so you
                can make smarter decisions.
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
    </section>
  );
};

export default LoginPage;
