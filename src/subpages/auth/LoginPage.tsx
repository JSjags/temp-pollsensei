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
import mixpanel from "mixpanel-browser";
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

const fadeIn = {
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
    onError: (error: any) => {
      // toast.error(
      //   "Failed to login user " +
      //     (error?.response?.data?.message || error.message)
      // );
      setLoginState(true);
    },
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
    setLoginState(true);
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

  if (user) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br"
      >
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
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br"
    >
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
              PollSensei helps you to create suggest questions, <br /> formats,
              methodologies
            </motion.h5>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {loginState && (
            <motion.div
              key="login"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full md:w-1/2 flex flex-col justify-center items-center px-4 md:px-8 py-6 md:py-0"
            >
              <div className="flex justify-center flex-col max-w-[516px] w-full">
                <motion.div
                  variants={fadeIn}
                  initial="initial"
                  animate="animate"
                  className="flex-col flex pb-6 md:pb-8 pt-6 md:pt-10"
                >
                  <h2 className="auth-header font-sans text-center md:text-left !text-2xl md:!text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                    Welcome back to PollSensei
                  </h2>
                  <p className="auth-title font-sans pt-3 text-center md:text-left text-gray-600">
                    The Best tool for your End-to-End Survey Solution
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
                      className="w-full space-y-4"
                    >
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

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="auth-btn w-full justify-center bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        type="submit"
                      >
                        {loginMutation.isPending ? (
                          <ClipLoader size={20} color="white" />
                        ) : (
                          "Sign In"
                        )}
                      </motion.button>
                    </motion.form>
                  )}
                />

                <motion.div
                  variants={fadeIn}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.4 }}
                  className="flex justify-center pt-5"
                >
                  <p className="bg-white shadow-md rounded-[1rem] py-2 px-4 text-sm">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/register"
                      className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] bg-clip-text text-transparent hover:from-[#5B03B2] hover:to-[#9D50BB] font-semibold"
                    >
                      Sign up
                    </Link>
                  </p>
                </motion.div>

                <div className="flex gap-3 md:gap-5 items-center pt-5">
                  <div className="border flex-grow border-[#E5EFFF]"></div>
                  <div className="auth-divider whitespace-nowrap text-gray-500">
                    or <span className="hidden md:inline">continue with</span>
                  </div>
                  <div className="border flex-grow border-[#E5EFFF]"></div>
                </div>

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
                        // mixpanel.track("Google Sign-In Clicked", {
                        //   timestamp: new Date().toISOString(),
                        // });
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
                  variants={fadeIn}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.8 }}
                  className="flex justify-end items-center mt-4"
                >
                  <p className="mr-2 text-gray-600">Need Help?</p>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Image
                      src={chat}
                      alt="Chat"
                      className="object-cover size-20 cursor-pointer"
                      width={24}
                      height={24}
                    />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
          {!loginState && (
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
          )}
        </AnimatePresence>
      </AnimatePresence>
    </motion.section>
  );
};

export default LoginPage;
