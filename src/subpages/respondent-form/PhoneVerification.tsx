"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IoClose } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { fetchOTP, confirmOTP } from "@/services/api/apiRequest";
import { APP_KEYS } from "@/constants";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setIsPhoneVerified } from "@/redux/slices/becomePaidRespondentSlice";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { FaChevronLeft } from "react-icons/fa6";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { formatTime } from "@/utils";
import { getCountries } from "@yusifaliyevpro/countries";

const PhoneVerification = () => {
  const [dialCode, setDialCode] = useState<string>("+234");
  const [phone, setPhone] = useState<string>("");
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(false);
  const [otp, setOTP] = useState<string>("");
  const [isOtp, setIsOtp] = useState<boolean>(false);
  const [inputOtp, setInputOtp] = useState<string>("");
  const [confirmOtp, setConfirmOTP] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const dispatch = useDispatch();
  const router = useRouter();

  const { data: nationalities, isLoading: isLoadingCountries } = useQuery({
    queryKey: [APP_KEYS.COUNTRY_FLAG],
    queryFn: async () => {
      const countries = await getCountries({
        fields: ["name", "flags", "idd"],
      });
      return countries;
    },
    enabled: true,
  });

  // console.log({ nationalities });

  const sortedNationalities = nationalities
    ? [...nationalities].sort((a, b) =>
        a.name.common.localeCompare(b.name.common)
      )
    : [];

  const filteredNationalities = sortedNationalities.filter((nationality) =>
    nationality.name.common.toLowerCase()
  );

  useEffect(() => {
    const phoneRegex = /^\d{10}$/;
    setIsPhoneValid(phoneRegex.test(phone));
  }, [phone]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0 && isOtp) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isOtp]);

  const phoneNumber = dialCode + phone;

  const handlePhoneVerification = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsOtp(true);
    setTimeLeft(300);
    setOTP("");
    try {
      const response = await fetchOTP(phoneNumber);
      setOTP(response);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message ?? "Wrong phone number, please try again.");
    }
  };

  const handleOTPVerification: (
    e: React.FormEvent<HTMLFormElement>
  ) => Promise<void> = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await confirmOTP(phoneNumber, inputOtp);
      setConfirmOTP(response.isPhoneVerified);
      if (response) {
        dispatch(setIsPhoneVerified(true));
        router.push("/respondent-form");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message ?? "Wrong OTP, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSlotChange = (index: number, value: string) => {
    const otpArray = inputOtp.split("");
    otpArray[index] = value;
    setInputOtp(otpArray.join(""));
  };

  const isOTPComplete = inputOtp.length === 6;

  const handleResendCode = () => {
    setOTP("");
    setTimeLeft(300);
  };

  return (
    <>
      {!isOtp ? (
        <div className="w-[70%] h-[70vh] flex flex-col gap-5 justify-center items-center bg-white rounded-lg m-auto shadow-md shadow-[A9A7A72E]">
          <h2 className="text-2xl font-bold">Verify Your Phone Number</h2>
          <p className="text-sm text-center px-16 lg:px-0 w-full lg:w-[50%]">
            To continue with the process if becoming a paid respondent, Add your
            phone number and enter the verification code that will be sent to
            you so we know you&apos;re real
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
                {nationalities && !isLoadingCountries && (
                  <Select
                    value={dialCode}
                    onValueChange={(value) => setDialCode(value)}
                  >
                    <SelectTrigger className="w-[100px] h-auto border-0 text-black text-sm rounded-md p-2 active:outline-none outline-none">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent className="w-[50px] h-[300px] overflow-auto scrollbar-hide">
                      <SelectGroup className="pr-2">
                        {filteredNationalities?.map((nationality: any) => {
                          if (
                            !nationality.flags ||
                            !nationality.name ||
                            !nationality.idd
                          )
                            return null;

                          // Handle the idd suffixes properly (it's an array)
                          const dialCodeValue =
                            nationality.idd.root +
                            (nationality.idd.suffixes
                              ? nationality.idd.suffixes[0]
                              : "");

                          return (
                            <SelectItem
                              key={nationality.name.common}
                              value={dialCodeValue}
                            >
                              <div className="w-full flex items-center gap-2">
                                <Image
                                  src={nationality?.flags?.png}
                                  alt={nationality?.name?.common}
                                  width={20}
                                  height={15}
                                />
                                <div className="flex items-center text-center">
                                  {dialCodeValue}
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
                {isLoadingCountries && (
                  <div className="w-[100px] h-auto border-0 text-black text-sm rounded-md p-2">
                    ...
                  </div>
                )}
                <div className="flex-1 flex items-center">
                  <input
                    type="tel"
                    id="Phone number"
                    placeholder="8115655628"
                    className={`flex-1 h-auto border-none outline-none bg-transparent active:bg-transparent text-black text-base py-2 px-3 active:outline-none`}
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
            </div>
            <Button
              variant="outline"
              size="default"
              className="w-full md:w-auto bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] shadow-[-5px_5px_10px_#563BFF42] hover:bg-purple-700 text-white hover:text-white rounded-md text-xs md:text-sm p-4 hover:scale-x-105 transition-all lg:mb-10 mt-5"
              type="submit"
              disabled={
                phone.length !== 10 ||
                !isPhoneValid ||
                isLoading ||
                isLoadingCountries
              }
            >
              Send OTP
            </Button>
          </form>
        </div>
      ) : (
        <div className="w-[70%] h-[70vh] flex flex-col gap-5 justify-center items-center bg-white rounded-lg m-auto shadow-md shadow-[A9A7A72E] relative">
          <FaChevronLeft
            className="absolute top-10 left-10 text-2xl text-[#5B03B2] cursor-pointer"
            onClick={() => setIsOtp(false)}
          />
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
              <div className="w-full flex items-center justify-center">
                <InputOTP
                  maxLength={6}
                  value={inputOtp}
                  onChange={(value) => setInputOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={0}
                      className="border-0 outline-none"
                      onChange={(e) =>
                        handleOTPSlotChange(
                          0,
                          (e.target as HTMLInputElement).value
                        )
                      }
                    />
                    <InputOTPSlot
                      index={1}
                      className="border-0 outline-none"
                      onChange={(e) =>
                        handleOTPSlotChange(
                          1,
                          (e.target as HTMLInputElement).value
                        )
                      }
                    />
                    <InputOTPSlot
                      index={2}
                      className="border-0 outline-none"
                      onChange={(e) =>
                        handleOTPSlotChange(
                          2,
                          (e.target as HTMLInputElement).value
                        )
                      }
                    />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={3}
                      className="border-0 outline-none"
                      onChange={(e) =>
                        handleOTPSlotChange(
                          3,
                          (e.target as HTMLInputElement).value
                        )
                      }
                    />
                    <InputOTPSlot
                      index={4}
                      className="border-0 outline-none"
                      onChange={(e) =>
                        handleOTPSlotChange(
                          4,
                          (e.target as HTMLInputElement).value
                        )
                      }
                    />
                    <InputOTPSlot
                      index={5}
                      className="border-0 outline-none"
                      onChange={(e) =>
                        handleOTPSlotChange(
                          5,
                          (e.target as HTMLInputElement).value
                        )
                      }
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p
                className={`text-sm ${
                  timeLeft <= 10 ? "text-red-500" : "text-[#898989]"
                }`}
              >
                {" "}
                {formatTime(timeLeft)}
              </p>
              <p className="text-xs text-[#333333]">
                Didn&apos;t receive any code?{" "}
                <span
                  className="text-[#5B03B2] font-bold cursor-pointer"
                  onClick={handleResendCode}
                >
                  {" "}
                  Resend New Code
                </span>{" "}
              </p>
            </div>
            <Button
              variant="outline"
              size="default"
              className="w-full md:w-auto bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] shadow-[-5px_5px_10px_#563BFF42] hover:bg-purple-700 text-white hover:text-white rounded-md text-xs md:text-sm p-4 hover:scale-x-105 transition-all lg:mb-10 mt-5"
              type="submit"
              disabled={!isOTPComplete || isLoading || confirmOtp}
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
