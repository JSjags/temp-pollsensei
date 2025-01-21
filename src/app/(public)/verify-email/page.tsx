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

const VerifyEmail = () => {
  const [message, setMessage] = useState("Verifying your email...");
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("reg-token");

  const { data, isLoading, isError, error } = useQuery<{
    success: boolean;
    message: string;
  }>({
    queryKey: ["verifyEmail", token],
    queryFn: async () => {
      if (!token) {
        throw new Error("Invalid verification link.");
      }
      const response = await axiosInstanceWithoutToken.get<{
        success: boolean;
        message: string;
      }>(`/auth/verify-email/${token}`);
      // Track successful registration completion with Facebook Pixel
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "CompleteRegistration", {
          value: 1,
        });
      }
      return response as any;
    },
    retry: false,
    enabled: !!token,
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
      setMessage(data.message || "Email verification successful!");
    }
  }, [data, isError]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

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
              <Button
                onClick={() => router.push("/login")}
                className="mt-4 bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] text-white px-8 py-2 rounded-full hover:opacity-90 transition-opacity"
              >
                Continue to Login
              </Button>
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
              <Button
                onClick={() => router.push("/")}
                className="mt-4 bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] text-white px-8 py-2 rounded-full hover:opacity-90 transition-opacity"
              >
                Return to Homepage
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
