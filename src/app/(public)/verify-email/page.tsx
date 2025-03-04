"use client";

import { pollsensei_new_logo } from "@/assets/images";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axiosInstanceWithoutToken from "@/lib/axios-instance-without-token";
import { updateUser } from "@/redux/slices/user.slice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const [message, setMessage] = useState("Verifying your email...");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpString, setOtpString] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const token = searchParams.get("reg-token");

  const { data, isLoading, isError, error } = useQuery<{
    success: boolean;
    message: string;
    access_token: string;
    user: any;
    data: { access_token: string; user: any };
  }>({
    queryKey: ["verifyEmail", token || otpString],
    queryFn: async () => {
      if (!token && !otpString) {
        throw new Error("Please enter the verification code.");
      }
      const response = await axiosInstanceWithoutToken.get(
        `/auth/verify-email/${token || otpString}`
      );

      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "CompleteRegistration", {
          value: 1,
        });
      }

      return response.data;
    },
    retry: false,
    enabled: !!token || !!otpString,
  });

  const verificationStatus = isLoading
    ? "loading"
    : isError
    ? "error"
    : "success";

  useEffect(() => {
    if (isError) {
      setMessage(
        (error as any)?.response?.data?.message ||
          (error as Error)?.message ||
          "Email verification failed."
      );
    } else if (data) {
      toast.success("Email verification successful!");
      if (data?.access_token && data?.user) {
        dispatch(
          updateUser({
            token: data.access_token,
            user: data.user,
          })
        );
        router.push("/dashboard");
      }
      if (data?.data?.access_token && data?.data?.user) {
        dispatch(
          updateUser({
            token: data?.data?.access_token,
            user: data?.data?.user,
          })
        );
        router.push("/dashboard");
      }
    }
  }, [data, isError, dispatch, router]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }

      // Submit when all fields are filled
      if (value && index === 5) {
        const completeOtp = newOtp.join("");
        setOtpString(completeOtp);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col items-center justify-center p-4">
        <motion.div
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col items-center text-center">
            <Image
              src={pollsensei_new_logo}
              alt="PollSensei Logo"
              className="w-48 mb-8"
            />

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Enter Verification Code
            </h1>
            <p className="text-gray-600 mb-6">
              Please enter the verification code sent to your email
            </p>

            <div className="flex gap-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-2xl border-2 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              ))}
            </div>

            {isLoading && <ClipLoader color="#9D50BB" size={30} />}

            {isError && <p className="text-red-500 mt-2">{message}</p>}

            <div className="flex gap-4 mt-6">
              <Button
                onClick={() => router.push("/login")}
                variant="outline"
                className="px-6"
              >
                Go to Login
              </Button>
              <Button
                onClick={() => router.push("/")}
                className="bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] text-white px-6"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-center text-center">
          <Image
            src={pollsensei_new_logo}
            alt="PollSensei Logo"
            className="w-48 mb-8"
          />

          {verificationStatus === "loading" && (
            <div className="flex flex-col items-center gap-4">
              <ClipLoader color="#9D50BB" size={50} />
              <p className="text-gray-600 mt-4">{message}</p>
            </div>
          )}

          {verificationStatus === "success" && (
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <CheckCircle2 className="w-16 h-16 text-green-500" />
              <h1 className="text-2xl font-bold text-gray-900">
                Verification Successful!
              </h1>
              <p className="text-gray-600">{message}</p>
              <p className="text-gray-600">Redirecting to dashboard...</p>
              <div className="flex gap-4 mt-4">
                <Button
                  onClick={() => router.push("/login")}
                  variant="outline"
                  className="px-6"
                >
                  Go to Login
                </Button>
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] text-white px-6"
                >
                  Go to Dashboard
                </Button>
              </div>
            </motion.div>
          )}

          {verificationStatus === "error" && (
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <XCircle className="w-16 h-16 text-red-500" />
              <h1 className="text-2xl font-bold text-gray-900">
                Verification Failed
              </h1>
              <p className="text-gray-600">{message}</p>
              <div className="flex gap-4 mt-4">
                <Button
                  onClick={() => router.push("/login")}
                  variant="outline"
                  className="px-6"
                >
                  Go to Login
                </Button>
                <Button
                  onClick={() => router.push("/")}
                  className="bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] text-white px-6"
                >
                  Back to Home
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
