"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IoClose } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import {
  fetchCountryCode,
  fetchOTP,
  confirmOTP,
} from "@/services/api/apiRequest";
import { ImNotification } from "react-icons/im";
import { APP_KEYS } from "@/constants";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setIsPhoneVerified } from "@/redux/slices/becomePaidRespondentSlice";

const PhoneVerification = () => {
  const [dialCode, setDialCode] = useState<string>("+234");
  const [phone, setPhone] = useState<string>("");
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(false);
  const [otp, setOTP] = useState<string>("");
  const [inputOtp, setInputOtp] = useState<string>("");
  const [confirmOtp, setConfirmOTP] = useState<string>("");
  const cleanDialCode = dialCode.replace(/[+-]/, "");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const { data: countryCodeData } = useQuery({
    queryKey: [APP_KEYS.COUNTRY_DIAL_CODE, cleanDialCode],
    queryFn: async () => fetchCountryCode(cleanDialCode),
    enabled: !!cleanDialCode,
  });

  useEffect(() => {
    const phoneRegex = /^\d{10}$/;
    setIsPhoneValid(phoneRegex.test(phone));
  }, [phone, countryCodeData]);

  const handlePhoneVerification = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetchOTP(phone);
      setOTP(response);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.data?.message ?? "Wrong phone number, please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification: (
    e: React.FormEvent<HTMLFormElement>
  ) => Promise<void> = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await confirmOTP(inputOtp);
      setConfirmOTP(response);
      if (response) {
        dispatch(setIsPhoneVerified(true));
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message ?? "Wrong OTP, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-[70%] h-[70vh] flex flex-col gap-5 justify-center items-center bg-white rounded-lg m-auto shadow-md shadow-[A9A7A72E]">
        <h2 className="text-2xl font-bold">Verify Your Phone Number</h2>
        <p className="text-sm text-center px-16 lg:px-0 w-full lg:w-[70%]">
          To continue with the process if becoming a paid respondent, Add your
          phone number and enter the verification code that will be sent to you
          so we know you&apos;re real
        </p>
        <form
          className="w-[70%] h-auto flex flex-col gap-3 px-24"
          onSubmit={handlePhoneVerification}
        >
          <div className="w-full h-auto flex flex-col gap-2">
            <label htmlFor="Phone number" className="text-[#333333] text-sm">
              Phone number
            </label>
            <div className="w-full flex items-center justify-between border border-[#E0E0E0] rounded-md px-2 gap-2">
              {countryCodeData && (
                <Image
                  src={countryCodeData?.flag}
                  alt={countryCodeData?.name}
                  width={20}
                  height={15}
                />
              )}
              <div className="w-full flex items-center">
                <input
                  type="tel"
                  id="nation code"
                  placeholder="+234"
                  className={`w-[20%] h-auto border-none outline-none bg-transparent text-black text-base py-2 px-3 active:outline-none`}
                  value={dialCode}
                  onChange={(e) => {
                    const input = e.target.value;
                    if (input.length <= 5) {
                      setDialCode(input);
                    }
                  }}
                />
                <input
                  type="tel"
                  id="Phone number"
                  placeholder="8115 6556 28"
                  className={`flex-1 h-auto border-none outline-none bg-transparent text-black text-base py-2 px-3 active:outline-none`}
                  value={phone}
                  onChange={(e) => {
                    const input = e.target.value;
                    if (input.length <= 10) {
                      setPhone(input);
                    }
                  }}
                />
              </div>
              <IoClose
                className="text-lg cursor-pointer text-[#898989] hover:text-black"
                onClick={() => setPhone("")}
              />
            </div>
            <div className="flex items-center gap-1">
              <ImNotification className="text-[10px] text-[#898989]" />
              <p className="text-[#898989] text-[9px]">
                Phone number must start with country dial code
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="default"
            className="w-full md:w-auto bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] shadow-[-5px_5px_10px_#563BFF42] hover:bg-purple-700 text-white rounded-md text-xs md:text-sm p-4 hover:scale-x-105 transition-all lg:mb-10 mt-5"
            type="submit"
            disabled={dialCode.length <= 2 || !isPhoneValid || isLoading}
          >
            Send OTP
          </Button>
        </form>
      </div>

      {otp && (
        <div className="w-[70%] h-[70vh] flex flex-col gap-5 justify-center items-center bg-white rounded-lg m-auto shadow-md shadow-[A9A7A72E]">
          <h2 className="text-2xl font-bold">Verify Your Phone Number</h2>
          <p className="text-sm text-center px-16 lg:px-0 w-full lg:w-[70%]">
            Enter your OTP code here
          </p>
          <form
            className="w-[70%] h-auto flex flex-col gap-3 px-24"
            onSubmit={handleOTPVerification}
          >
            <div className="w-full h-auto flex flex-col gap-2">
              <label htmlFor="otp code" className="text-[#333333] text-sm">
                Verification Code
              </label>
              <div className="w-full grid grid-cols-4 items-center justify-between gap-5">
                <input
                  type="number"
                  id="otp code"
                  placeholder="0"
                  className={`w-full h-[40px] border border-[#E0E0E0] rounded-md px-2 bg-transparent text-black text-base py-2 text-center`}
                  value={inputOtp}
                  onChange={(e) => {
                    const input = e.target.value;
                    if (input.length <= 5) {
                      setInputOtp(input);
                    }
                  }}
                />
                <input
                  type="number"
                  id="otp code"
                  placeholder="0"
                  className={`w-full h-[40px] border border-[#E0E0E0] rounded-md px-2 bg-transparent text-black text-base py-2 text-center`}
                  value={inputOtp}
                  onChange={(e) => {
                    const input = e.target.value;
                    if (input.length <= 5) {
                      setInputOtp(input);
                    }
                  }}
                />
                <input
                  type="number"
                  id="otp code"
                  placeholder="0"
                  className={`w-full h-[40px] border border-[#E0E0E0] rounded-md px-2 bg-transparent text-black text-base py-2 text-center`}
                  value={inputOtp}
                  onChange={(e) => {
                    const input = e.target.value;
                    if (input.length <= 5) {
                      setInputOtp(input);
                    }
                  }}
                />
                <input
                  type="number"
                  id="otp code"
                  placeholder="0"
                  className={`w-full h-[40px] border border-[#E0E0E0] rounded-md px-2 bg-transparent text-black text-base py-2 text-center`}
                  value={inputOtp}
                  onChange={(e) => {
                    const input = e.target.value;
                    if (input.length <= 5) {
                      setInputOtp(input);
                    }
                  }}
                />
              </div>
              <p className="text-[#898989] text-sm">00:59s</p>
              <p className="text-xs text-[#333333]">
                Didn’t receive any code?{" "}
                <span className="text-[#5B03B2] font-bold">
                  {" "}
                  Resend New Code
                </span>{" "}
              </p>
            </div>
            <Button
              variant="outline"
              size="default"
              className="w-full md:w-auto bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] shadow-[-5px_5px_10px_#563BFF42] hover:bg-purple-700 text-white rounded-md text-xs md:text-sm p-4 hover:scale-x-105 transition-all lg:mb-10 mt-5"
              type="submit"
              disabled={!inputOtp || isLoading}
            >
              Verify Now
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

export default PhoneVerification;
