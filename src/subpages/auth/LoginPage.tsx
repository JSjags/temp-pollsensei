"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { Form, Field } from "react-final-form";
import validate from "validate.js";
import Link from "next/link";
import { ClipLoader } from "react-spinners";
import Image from "next/image";
import steps from "../../assets/auth/steps2.svg";
import logo from "../../assets/auth/logo.svg";
import google from "../../assets/auth/goggle.svg";
import facebook from "../../assets/auth/facebook.svg";
import chat from "../../assets/auth/chat.svg";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/slices/user.slice";
import { useState } from "react";
import StateLoader from "../../components/common/StateLoader";
import { useGoogleLoginMutation, useLoginUserMutation } from "../../services/user.service";
import PasswordField from "../../components/ui/PasswordField";
import Input from "@/components/ui/Input";
import { dark_theme_logo } from "@/assets/images";

const Client_Id = process.env.VITE_NEXT_GOOGLE_REG_CLIENT_ID;
console.log(Client_Id);


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

const LoginPage = () => {
  const [loginUser, { data }] = useLoginUserMutation();
  const dispatch = useDispatch();
  const [loginState, setLoginState] = useState(true);
  const [state, setState] = useState(false);
  const [eyeState, setEyeState] = useState(false);
  const [googleLogin, { data: register, error: registerError }] =
  useGoogleLoginMutation();

  const onSubmit = async (values: { email: string; password: string }) => {
    try {
      const userData = await loginUser(values).unwrap();
      dispatch(updateUser(userData.data));
      toast.success("Login success");
      setState(true);
      setLoginState(false);
    } catch (err: any) {
      toast.error(
        "Failed to login user " + (err?.data?.message || err.message)
      );
      console.error("Failed to log in user", err);
    }
  };

  const validateForm = (values: any) => {
    return validate(values, constraints) || {};
  };

  const toggleEye = (e: React.MouseEvent) => {
    e.preventDefault();
    setEyeState((prev) => !prev);
  };


  // const googleSignUp = useGoogleLogin({
  //   onSuccess: async (response) => {
  //     const authCode = response.code;
  //     const requestData = {
  //       code: authCode,
  //     };

  //     try {
  //       await googleLogin(requestData).unwrap();
  //       toast.success("Log in success");
  //     } catch (err: any) {
  //       toast.error(
  //         "Failed to log in user " + (err?.data?.message || err.message)
  //       );
  //       console.error("Failed to sign in user", err);
  //     }
  //   },
  //   onError: () => console.log("Google Sign-In Failed"),
  //   flow: "auth-code",
  //   scope: 'https://www.googleapis.com/auth/userinfo.profile',
  // });


  const googleSignUp = useGoogleLogin({
    onSuccess: async (response) => {
      const accessToken = response.access_token; // Directly get the access token
  
      try {
        const userData =  await googleLogin({ code: accessToken }).unwrap();
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

  console.log(data);
  return (
    <section className="min-h-screen flex flex-col md:flex-row">
      <div className="auth-bg md:hidden flex items-center justify-center p-4">
        <div className="flex items-center justify-center gap-3">
          <Image src={logo} alt="Logo" width={32} height={32} />
          <h1 className="auth-head">PollSensei</h1>
        </div>
      </div>
      <div className="auth-bg hidden md:flex md:w-1/2 flex-col justify-center items-center p-8">
        <div className="flex flex-col items-center max-w-md w-full">
          <div className="flex items-center justify-center gap-3 pb-10">
            <Image src={dark_theme_logo} alt="Logo" width={200} height={32} />
            {/* <h1 className="auth-head">PollSensei</h1> */}
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
            PollSensei helps you to Create suggest questions, <br /> formats,
            methodologies
          </h5>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-4 md:px-8 py-6 md:py-0">
        {loginState && (
          <div className="flex justify-center flex-col max-w-[516px] w-full">
            <div className="flex-col flex pb-6 md:pb-8 pt-6 md:pt-10">
              <h2 className="auth-header font-sans text-center md:text-left">
                Welcome back to PollSensei
              </h2>
              <p className="auth-title font-sans pt-3 text-center md:text-left">
                The Best tool for your End-to-End Survey Solution
              </p>
            </div>

            <Form
              onSubmit={onSubmit}
              validate={validateForm}
              render={({ handleSubmit, form, submitting }) => (
                <form onSubmit={handleSubmit} className="w-full">
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
                    <Link href="/forgot-password">Forgot Password?</Link>
                  </div>

                  <button
                    className="auth-btn w-full justify-center"
                    type="submit"
                  >
                    {submitting ? <ClipLoader size={20} /> : "Sign In"}
                  </button>
                </form>
              )}
            />

            <div className="flex justify-center pt-5">
              <p className="bg-[#F7F7F7] rounded-[1rem] py-[2px] px-[calc(1rem/2)] text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/register">Sign up</Link>
              </p>
            </div>

            <div className="flex gap-3 md:gap-5 items-center pt-5">
              <div className="border flex-grow border-[#E5EFFF]"></div>
              <div className="auth-divider whitespace-nowrap">
                Or <span className="hidden md:inline">Continue with</span>
              </div>
              <div className="border flex-grow border-[#E5EFFF]"></div>
            </div>

            <div className="social-icons flex justify-center items-center gap-4 pt-5">
              <span onClick={()=>googleSignUp()} >
                <Image
                  src={google}
                  alt="Google"
                  width={24}
                  height={24}
                  className="size-10"
                />
              </span>
              {/* <Link href="">
                <Image
                  src={facebook}
                  alt="Facebook"
                  width={24}
                  height={24}
                  className="size-10"
                />
              </Link> */}
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
        )}
        {state && <StateLoader goto="/dashboard" />}
      </div>
    </section>
  );
};

export default LoginPage;
