"use client";
import React, { FC, useState, useEffect, useMemo } from "react";
import { Arrow, Purchases1 } from "@/assets/images";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight, Loader2, X } from "lucide-react";
import { Checkbox } from "@/components/ui/shadcn-checkbox";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TimePicker } from "@/components/ui/time-picker";
import confirm from "@/assets/images/confirm.svg";
import congrats from "@/assets/images/congrats.svg";
import logoGold from "@/assets/images/logo-gold.png";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  closeQuickSurveyFlow,
  proceedToForm,
  proceedToPurchase,
  proceedToConfirm,
  proceedToCongratulations,
  setSelectedRespondentsNumber,
  setFormData,
  setDuration,
  setConditions,
  setAllowFilterRespondentsAccess,
  setQuickSurveyId,
  setSurveyId,
  resetDialogState,
  setQuickSurveyQualifyingTemplateId,
  setQuickSurveyScreenerId,
} from "@/redux/slices/quickSurveySlice";
import { useQuery } from "@tanstack/react-query";
import {
  CreateQuickSurvey,
  DirectQuickSurvey,
  QuickSurveyQualifyingPurchase,
  QuickSurveyScreenerPurchase,
} from "@/services/api/apiRequest";
import { resetQuestion } from "@/redux/slices/questions.slice";
import { resetSurvey } from "@/redux/slices/survey.slice";
import { useQueryClient } from "@tanstack/react-query";
import { CiClock2 } from "react-icons/ci";
import quick from "@/assets/images/quick.png";

interface Props {
  surveyId: string | null;
}

// Utility functions for time validation and conversion
const getTotalMinutes = (date: Date): number => {
  return date.getHours() * 60 + date.getMinutes();
};

const createDateFromMinutes = (totalMinutes: number): Date => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  date.setHours(hours, minutes);
  return date;
};

// Updated schema for QuickSurvey with Date validation
const quickSurveySchema = z.object({
  respondentsNumber: z
    .number()
    .min(1, "Number of respondents must be at least 1"),
  duration: z
    .date()
    .refine((date) => {
      const totalMinutes = getTotalMinutes(date);
      return totalMinutes >= 1;
    }, "Duration must be at least 1 minute")
    .refine((date) => {
      const totalMinutes = getTotalMinutes(date);
      return totalMinutes <= 720;
    }, "Duration cannot exceed 12 hours"),
  conditions: z
    .object({
      durationElapsed: z.boolean(),
      respondentsNumberMet: z.boolean(),
    })
    .refine((data) => data.durationElapsed || data.respondentsNumberMet, {
      message: "At least one condition must be selected",
      path: ["conditions"],
    }),
});

type QuickSurveyFormData = z.infer<typeof quickSurveySchema>;

const BuyQuickSurveyRespondent: FC<Props> = ({ surveyId }) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const [isProceedConvertion, setIsProceedConvertion] =
    useState<boolean>(false);

  const {
    showQuickSurveyFlow,
    currentDialog,
    selectedRespondentsNumber,
    quickSurveyId,
    formData,
    quickSurveyScreenerId,
    quickSurveyQualifyingTemplateId,
  } = useSelector((state: RootState) => state.quickSurvey);

  const [isProceeding, setIsProceeding] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>("");
  const surveyTopic = useSelector(
    (state: RootState) =>
      state?.quickSurvey?.formData?.surveyTopic || state?.survey?.topic
  );
  // const surveyLog = useSelector((state: RootState) => state?.survey);

  // console.log({ surveyLog });
  // Initialize default duration (1 hour)
  const defaultDuration = React.useMemo(() => {
    const date = new Date();
    date.setHours(1, 0, 0, 0);
    return date;
  }, []);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
    setValue,
  } = useForm<QuickSurveyFormData>({
    resolver: zodResolver(quickSurveySchema),
    defaultValues: {
      respondentsNumber: formData.respondentsNumber || 0,
      duration: formData.duration
        ? createDateFromMinutes(parseInt(formData.duration) * 60)
        : defaultDuration,
      conditions: {
        durationElapsed: formData.conditions?.durationElapsed || false,
        respondentsNumberMet:
          formData.conditions?.respondentsNumberMet || false,
      },
    },
  });

  const respondentsNumber = watch("respondentsNumber");
  const duration = watch("duration");
  const conditions = watch("conditions");

  const handleProceedToBuyRespondent = async () => {
    setIsProceedConvertion(true);
    try {
      const response = await CreateQuickSurvey(surveyId);
      if (response) {
        dispatch(setQuickSurveyId(response?._id));
        dispatch(proceedToForm());
      }
      setIsProceedConvertion(false);
    } catch (e) {
      console.error("Failed to create quicksurvey", e);
    } finally {
      setIsProceedConvertion(false);
    }
  };

  const handleCloseQuickSurveyModal = () => {
    dispatch(closeQuickSurveyFlow());
    router.push("/surveys/survey-list");
    dispatch(resetSurvey());
    dispatch(resetQuestion());
    dispatch(setQuickSurveyScreenerId(null));
    dispatch(setQuickSurveyQualifyingTemplateId(null));
  };

  // Close the entire flow
  const handleCloseFlow = () => {
    dispatch(closeQuickSurveyFlow());
    router.push("/surveys/survey-list");
    dispatch(resetSurvey());
    dispatch(resetQuestion());
    dispatch(setQuickSurveyScreenerId(null));
    dispatch(setQuickSurveyQualifyingTemplateId(null));
  };

  useEffect(() => {
    if (formData.respondentsNumber) {
      setValue("respondentsNumber", formData.respondentsNumber);
    }
    if (formData.duration) {
      // FIXED: formData.duration is now stored as total minutes, not hours
      const durationInMinutes = parseInt(formData.duration); // Direct minutes value
      setValue("duration", createDateFromMinutes(durationInMinutes));
    }
    if (formData.conditions) {
      setValue("conditions", formData.conditions);
    }
  }, [formData, setValue]);

  const handleNext = (data: QuickSurveyFormData) => {
    const totalMinutes = getTotalMinutes(data.duration); // This will be 5, 60, 120, etc.

    dispatch(setSelectedRespondentsNumber(data.respondentsNumber));
    sessionStorage.setItem(
      "selectedRespondentsNumber",
      data.respondentsNumber.toString()
    );

    // FIXED: Store total minutes instead of hours
    dispatch(setDuration(totalMinutes.toString()));
    dispatch(setConditions(data.conditions));

    dispatch(
      setFormData({
        surveyTopic: surveyTopic,
        respondentsNumber: data.respondentsNumber,
        duration: totalMinutes.toString(), // Send minutes: 5, 60, 120, etc.
        conditions: data.conditions,
      })
    );

    dispatch(proceedToPurchase());
  };

  const handlePurchaseCancel = () => {
    dispatch(closeQuickSurveyFlow());
    router.push("/surveys/survey-list");
    dispatch(resetSurvey());
    dispatch(resetQuestion());
    dispatch(setQuickSurveyScreenerId(null));
    dispatch(setQuickSurveyQualifyingTemplateId(null));
  };

  const handlePurchaseProceed = () => {
    dispatch(proceedToConfirm());
  };

  const handleConfirmCancel = () => {
    dispatch(closeQuickSurveyFlow());
    router.push("/surveys/survey-list");
    dispatch(resetSurvey());
    dispatch(resetQuestion());
    dispatch(resetDialogState());
    dispatch(setQuickSurveyScreenerId(null));
    dispatch(setQuickSurveyQualifyingTemplateId(null));
    reset();
  };

  const handleDirectQuickSurvey = async () => {
    try {
      const totalMinutes = getTotalMinutes(duration);

      const response = await DirectQuickSurvey(
        quickSurveyId,
        selectedRespondentsNumber,
        totalMinutes,
        conditions.respondentsNumberMet,
        conditions.durationElapsed
      );
      if (response.notifications_sent === true) {
        dispatch(proceedToCongratulations());
      } else {
        setApiError(response.message || "Purchase failed");
      }
    } catch (error) {
      console.error("Error purchasing respondents:", error);
      setApiError(
        error instanceof Error
          ? error.message
          : "An error occurred while processing your purchase"
      );
    } finally {
      setIsProceeding(false);
    }
  };

  const handleQuickSurveyQualifyingPurchase = async (
    quickSurveyQualifyingTemplateId: string
  ) => {
    try {
      const totalMinutes = getTotalMinutes(duration);

      const response = await QuickSurveyQualifyingPurchase(
        quickSurveyId,
        selectedRespondentsNumber,
        totalMinutes,
        conditions.respondentsNumberMet,
        conditions.durationElapsed,
        quickSurveyQualifyingTemplateId
      );
      if (response.notifications_sent === true) {
        dispatch(proceedToCongratulations());
      } else {
        setApiError(response.message || "Purchase failed");
      }
    } catch (error) {
      console.error("Error purchasing respondents:", error);
      setApiError(
        error instanceof Error
          ? error.message
          : "An error occurred while processing your purchase"
      );
    } finally {
      setIsProceeding(false);
    }
  };

  const handleQuickSurveyScreenerPurchase = async (
    quickSurveyScreenerId: string
  ) => {
    try {
      const totalMinutes = getTotalMinutes(duration);

      const response = await QuickSurveyScreenerPurchase(
        quickSurveyId,
        selectedRespondentsNumber,
        totalMinutes,
        conditions.respondentsNumberMet,
        conditions.durationElapsed,
        quickSurveyScreenerId
      );
      if (response.notifications_sent === true) {
        dispatch(proceedToCongratulations());
      } else {
        setApiError(response.message || "Purchase failed");
      }
    } catch (error) {
      console.error("Error purchasing respondents:", error);
      setApiError(
        error instanceof Error
          ? error.message
          : "An error occurred while processing your purchase"
      );
    } finally {
      setIsProceeding(false);
    }
  };

  const handleConfirmProceed = async () => {
    setIsProceeding(true);

    if (quickSurveyQualifyingTemplateId) {
      await handleQuickSurveyQualifyingPurchase(
        quickSurveyQualifyingTemplateId
      );
    } else if (quickSurveyScreenerId) {
      await handleQuickSurveyScreenerPurchase(quickSurveyScreenerId);
    } else {
      await handleDirectQuickSurvey();
    }
  };

  const handleCongratulationsContinue = () => {
    dispatch(closeQuickSurveyFlow());
    dispatch(resetDialogState());
    dispatch(resetQuestion());
    dispatch(resetSurvey());
    router.push("/surveys/survey-list");
  };

  const handleClick = () => {
    const data = {
      respondentsNumber: watch("respondentsNumber"),
      duration: watch("duration"),
      conditions: watch("conditions"),
    };
    handleFilterRespondentsRedirect(data);
  };

  const handleFilterRespondentsRedirect = (data: QuickSurveyFormData) => {
    const totalMinutes = getTotalMinutes(data.duration);

    dispatch(setSelectedRespondentsNumber(data.respondentsNumber));
    sessionStorage.setItem("allowFilterRespondentsAccess", "true");

    dispatch(closeQuickSurveyFlow());
    dispatch(setQuickSurveyScreenerId(null));
    dispatch(setQuickSurveyQualifyingTemplateId(null));

    dispatch(
      setFormData({
        surveyTopic: surveyTopic,
        respondentsNumber: data.respondentsNumber,
        duration: totalMinutes.toString(), // FIXED: Send total minutes
        conditions: data.conditions,
      })
    );
    dispatch(setSurveyId(surveyId));
    router.push("/filter-respondents");

    dispatch(resetQuestion());
    dispatch(resetSurvey());
  };

  const totalMinutesValue = useMemo(() => {
    if (!duration) return 0;
    return getTotalMinutes(duration);
  }, [duration]);

  // Get formatted duration for display
  const selectedDurationLabel = useMemo(() => {
    if (!duration) return "";

    const hours = duration.getHours();
    const minutes = duration.getMinutes();

    // console.log("Duration debug:", {
    //   hours,
    //   minutes,
    //   totalMinutes: totalMinutesValue,
    // });

    if (hours === 0) {
      return `${minutes} minute${minutes === 1 ? "" : "s"}`;
    } else if (minutes === 0) {
      return `${hours} hour${hours === 1 ? "" : "s"}`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  }, [duration]); // Correct dependencies

  if (!showQuickSurveyFlow) {
    return null;
  }

  return (
    <div className="bg-transparent rounded-lg md:gap-3 py-2.5 flex flex-col items-center w-full">
      {/* INITIAL DIALOG - "Convert to QuickSurvey" */}
      <Dialog open={currentDialog === "initial"} onOpenChange={undefined}>
        <DialogContent
          className="min-w-[90%] lg:min-w-[300px] min-h-auto bg-white border-0 outline-none p-0 flex flex-col justify-center items-center gap-5 relative rounded-t-md"
          style={{
            zIndex: 100000000,
            position: "fixed",
          }}
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            e.preventDefault();
          }}
        >
          <button
            onClick={handleCloseQuickSurveyModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors bg-white z-50 rounded-full p-1"
            type="button"
          >
            <X size={20} />
          </button>

          <div className="w-full h-auto flex justify-center items-center bg-[#F3ECF5]">
            <Image src={quick} alt="quick survey" width={300} height={300} />
          </div>
          <div className="w-full h-auto flex flex-col gap-5 p-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl text-center font-bold">
                Convert to QuickSurvey
              </h2>
              <div className="flex flex-col gap-1">
                <p className="text-base text-[#898989]">
                  - Quickly gather responses within a set timeframe. <br />
                  - Easily target a specific number of respondents. <br />
                  - Streamlined process for converting traditional surveys into
                  QuickSurveys. <br />
                  - Enhanced engagement with respondents due to time-sensitive
                  nature. <br />- Improved data collection efficiency and speed.
                </p>
              </div>
            </div>
            <div className="w-full flex flex-col gap-3">
              <Button
                type="button"
                variant="default"
                onClick={handleProceedToBuyRespondent}
                className="w-full flex-1 bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] shadow-[-5px_5px_10px_#563BFF42] hover:bg-purple-700 hover:scale-x-105 transition-all"
              >
                {isProceedConvertion ? "Converting Survey..." : "Yes, proceed"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseQuickSurveyModal}
                className="w-full flex-1 border-[#5B03B2] outline-[#5B03B2] hover:bg-none"
              >
                No, just publish
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* FORM DIALOG - Buy Respondents Form */}
      <Dialog open={currentDialog === "form"} onOpenChange={undefined}>
        <DialogContent
          className="min-w-[90%] lg:min-w-[400px] min-h-auto bg-white border-0 outline-none flex flex-col justify-center items-center gap-5 relative"
          style={{
            zIndex: 100000000,
            position: "fixed",
          }}
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            e.preventDefault();
          }}
        >
          <button
            onClick={handleCloseFlow}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors bg-white z-50 rounded-full p-1"
            type="button"
          >
            <X size={20} />
          </button>
          <form
            className="w-full flex flex-col justify-center items-center gap-7 p-5"
            onSubmit={handleSubmit(handleNext)}
          >
            <h1 className="text-lg lg:text-2xl font-bold text-center">
              Buy Respondents
            </h1>

            {/* Duration Section */}
            <div className="w-full flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <label htmlFor="duration" className="text-[#333333] text-sm">
                  Duration
                </label>
                <Controller
                  name="duration"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-2">
                      <TimePicker
                        date={field.value}
                        setDate={(date) => {
                          field.onChange(date);
                        }}
                      />
                    </div>
                  )}
                />
                {errors.duration && (
                  <p className="text-red-500 text-sm">
                    {errors.duration.message}
                  </p>
                )}
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] lg:text-xs">Maximum hours</span>
                  <span className="text-[10px] lg:text-xs font-semibold">
                    12 hours
                  </span>
                </div>
              </div>
            </div>

            {/* Respondents Number Section */}
            <div className="w-full flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <label htmlFor="respondentsNumber" className="text-xs">
                  Number of Respondents
                </label>
                <input
                  type="number"
                  id="respondentsNumber"
                  placeholder="Enter number of Respondents"
                  className="w-full h-auto border-2 border-[#E0E0E0] text-black text-sm rounded-md py-2 px-3 active:outline-none"
                  {...register("respondentsNumber", {
                    valueAsNumber: true,
                  })}
                />
                {errors.respondentsNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.respondentsNumber.message}
                  </p>
                )}
                <div className="w-full flex items-center justify-between">
                  <p className="text-[10px] lg:text-xs">
                    Number of respondents:{" "}
                    <span className="font-bold">{respondentsNumber || 0}</span>
                  </p>
                  <p className="text-[10px] lg:text-xs">
                    Cost:{" "}
                    <div className="w-auto flex items-center gap-1">
                      <Image
                        src={logoGold}
                        width={15}
                        height={15}
                        alt="logoGold"
                      />
                      <p className="text-base lg:text-lg text-[#5F08B2]">
                        {respondentsNumber * 5 || 0}
                      </p>
                    </div>
                  </p>
                </div>
              </div>
            </div>

            {/* Conditions Section */}
            <div className="w-full flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <label htmlFor="conditions" className="text-xs">
                  Set condition for closing survey
                </label>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Controller
                      name="conditions.durationElapsed"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            dispatch(
                              setConditions({
                                ...conditions,
                                durationElapsed: checked as boolean,
                              })
                            );
                          }}
                        />
                      )}
                    />
                    <p>Duration has elapsed</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Controller
                      name="conditions.respondentsNumberMet"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            dispatch(
                              setConditions({
                                ...conditions,
                                respondentsNumberMet: checked as boolean,
                              })
                            );
                          }}
                        />
                      )}
                    />
                    <p>Number of respondents is met</p>
                  </div>
                </div>
                {errors.conditions && (
                  <p className="text-red-500 text-sm">
                    {errors.conditions.message}
                  </p>
                )}
              </div>
            </div>

            <div className="w-full flex items-center justify-center gap-5">
              <Button
                variant="outline"
                size="sm"
                className="w-full lg:w-1/2 border-[#5B03B2] outline-[#5B03B2] hover:bg-none hover:scale-x-105 transition-all"
                type="button"
                onClick={handleClick}
                disabled={!respondentsNumber || !duration}
              >
                <span className="hidden lg:inline-block">
                  Filter Respondents
                </span>
                <span className="inline-block lg:hidden text-xs">
                  Set Qualifying questions
                </span>
              </Button>
              <Button
                variant="default"
                size="sm"
                className="w-full lg:w-1/2 bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] shadow-[-5px_5px_10px_#563BFF42] hover:bg-purple-700 hover:scale-x-105 transition-all"
                type="submit"
                disabled={!respondentsNumber || !duration}
              >
                Proceed
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* PURCHASE SUMMARY DIALOG */}
      <Dialog open={currentDialog === "purchase"} onOpenChange={undefined}>
        <DialogContent
          className="min-w-[90%] lg:min-w-[300px] min-h-auto bg-white border-0 outline-none p-5 flex flex-col justify-center items-center gap-5 relative"
          style={{
            zIndex: 100000000,
            position: "fixed",
          }}
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            e.preventDefault();
          }}
        >
          <button
            onClick={handlePurchaseCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors bg-white z-50 rounded-full p-1"
            type="button"
          >
            <X size={20} />
          </button>
          <h1 className="text-lg lg:text-2xl font-bold text-center">
            Purchase Summary
          </h1>
          <div className="w-full h-auto flex flex-col gap-5">
            <div className="w-full flex flex-col gap-2">
              <p className="font-bold text-sm border-b-2 border-[#A9A9B1] border-dotted pb-2">
                Title of Survey
              </p>
              <p className="text-sm capitalize">
                {surveyTopic || "No survey topic"}
              </p>
            </div>
            <div className="w-full flex flex-col gap-2">
              <p className="font-bold text-sm border-b-2 border-[#A9A9B1] border-dotted pb-2">
                Duration
              </p>
              <p className="text-sm capitalize">{selectedDurationLabel}</p>
            </div>
            <div className="w-full flex flex-col gap-2">
              <p className="font-bold text-sm border-b-2 border-[#A9A9B1] border-dotted pb-2">
                Conditions
              </p>
              <div className="text-sm">
                {conditions.durationElapsed && <p>• Duration has elapsed</p>}
                {conditions.respondentsNumberMet && (
                  <p>• Number of respondents is met</p>
                )}
              </div>
            </div>
            <p className="font-bold text-sm">Respondents:</p>
            <div className="w-full flex flex-col gap-7">
              <div className="w-full flex justify-between items-center border-b border-dotted border-[#A9A9B1] pb-2">
                <p className="text-xs lg:text-sm font-bold">
                  Total number of Respondents
                </p>
                <p className="text-base lg:text-lg text-[#5F08B2]">
                  {selectedRespondentsNumber}
                </p>
              </div>
              <div className="w-full flex justify-between items-center border-b border-dotted border-[#A9A9B1] pb-2">
                <p className="text-xs lg:text-sm font-bold">
                  Unit cost per Respondent
                </p>
                <div className="w-auto flex items-center gap-1">
                  <Image src={logoGold} width={15} height={15} alt="logoGold" />
                  <p className="text-base lg:text-lg text-[#5F08B2]">5</p>
                </div>
              </div>
              <div className="w-full flex justify-between items-center border-b border-dotted border-[#A9A9B1] pb-2">
                <p className="text-xs lg:text-sm font-bold">
                  Number of PollCoins
                </p>
                <div className="w-auto flex items-center gap-1">
                  <Image src={logoGold} width={15} height={15} alt="logoGold" />
                  <p className="text-base lg:text-lg text-[#5F08B2]">
                    {selectedRespondentsNumber * 5}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-[#898989] text-xs lg:text-sm">
              Are you sure you want to proceed with this purchase?
            </p>
            <div className="w-full flex items-center justify-center gap-5">
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-transparent hover:bg-transparent text-[#898989] border-[#563BFF42] shadow-sm hover:scale-x-105 transition-all"
                onClick={handlePurchaseCancel}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                className="w-full bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] shadow-[-5px_5px_10px_#563BFF42] hover:bg-purple-700 hover:scale-x-105 transition-all"
                onClick={handlePurchaseProceed}
              >
                Proceed
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* CONFIRM DIALOG */}
      <Dialog open={currentDialog === "confirm"} onOpenChange={undefined}>
        <DialogContent
          className="min-w-[90%] lg:min-w-[300px] min-h-auto bg-white border-0 outline-none p-5 flex flex-col justify-center items-center gap-5 relative"
          style={{
            zIndex: 100000000,
            position: "fixed",
          }}
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            e.preventDefault();
          }}
        >
          <button
            onClick={handleConfirmCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors bg-white z-50 rounded-full p-1"
            type="button"
          >
            <X size={20} />
          </button>
          <Image src={confirm} width={150} height={150} alt="confirm" />
          <h1 className="text-base lg:text-2xl font-bold text-center">
            Confirm Purchase
          </h1>
          {apiError && (
            <p className="text-red-500 text-sm text-center">{apiError}</p>
          )}
          <p className="text-sm lg:text-base text-[#898989] text-center">
            Are you sure you want to purchase this QuickSurvey?
          </p>
          <div className="w-full flex items-center justify-center gap-5">
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-transparent hover:bg-transparent text-[#898989] border-[#563BFF42] shadow-sm hover:scale-x-105 transition-all"
              onClick={handleConfirmCancel}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              className="w-full bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] shadow-[-5px_5px_10px_#563BFF42] hover:bg-purple-700 hover:scale-x-105 transition-all"
              onClick={handleConfirmProceed}
              disabled={isProceeding}
            >
              {isProceeding ? "Processing..." : "Proceed"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* CONGRATULATIONS DIALOG */}
      <Dialog
        open={currentDialog === "congratulations"}
        onOpenChange={undefined}
      >
        <DialogContent
          className="min-w-[90%] md:min-w-[300px] min-h-auto bg-white border-0 outline-none p-5 lg:px-10 py-5 flex flex-col justify-center items-center gap-5 relative"
          style={{
            zIndex: 100000000,
            position: "fixed",
          }}
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            e.preventDefault();
          }}
        >
          <button
            onClick={handleCongratulationsContinue}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors bg-white z-50 rounded-full p-1"
            type="button"
          >
            <X size={20} />
          </button>
          <Image src={congrats} width={250} height={250} alt="congrats" />
          <h1 className="text-base lg:text-[28px] font-bold text-center text-[#333333]">
            Congratulations!
          </h1>
          <p className="text-sm lg:text-base text-[#898989] text-center">
            Your QuickSurvey has been successfully launched
          </p>
          <Button
            variant="default"
            size="sm"
            className="w-full bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] shadow-[-5px_5px_10px_#563BFF42] hover:bg-purple-700 hover:scale-x-105 transition-all"
            onClick={handleCongratulationsContinue}
          >
            Continue
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuyQuickSurveyRespondent;
