"use client";
import React, { useState, useEffect } from "react";
import { Arrow, Purchases1 } from "@/assets/images";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { surveySchema } from "@/utils/shema";
import { surveyOptions } from "@/data/respondent-object-data";
import confirm from "@/assets/images/confirm.svg";
import congrats from "@/assets/images/congrats.svg";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setSurveyDialog,
  setPurchaseDialog,
  setConfirmDialog,
  setCongratulationsDialog,
  setSelectedSurvey,
  setSelectedRespondentsNumber,
  setFormData,
  resetDialogState,
} from "@/redux/slices/buyRespondentDialogSlice";

const BuyRespondent = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const {
    surveyDialog,
    purchaseDialog,
    confirmDialog,
    congratulationsDialog,
    selectedSurvey,
    selectedRespondentsNumber,
    formData,
  } = useSelector((state: RootState) => state.respondentDialog);

  const [searchSurvey, setSearchSurvey] = useState<string>("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(surveySchema),
    defaultValues: formData,
  });

  type FormData = z.infer<typeof surveySchema>;

  const surveyType = watch("survey");
  const respondentsNumber = watch("respondentsNumber");

  useEffect(() => {
    const savedSurvey = sessionStorage.getItem("selectedSurvey");
    const savedRespondentsNumber = sessionStorage.getItem(
      "selectedRespondentsNumber"
    );

    if (savedSurvey) {
      dispatch(setSelectedSurvey(savedSurvey));
      setValue("survey", savedSurvey);
    }
    if (savedRespondentsNumber) {
      dispatch(setSelectedRespondentsNumber(Number(savedRespondentsNumber)));
      setValue("respondentsNumber", Number(savedRespondentsNumber));
    }
  }, [dispatch, setValue]);

  // Update form fields with data from Redux store
  useEffect(() => {
    if (formData.survey) {
      setValue("survey", formData.survey);
    }
    if (formData.respondentsNumber) {
      setValue("respondentsNumber", formData.respondentsNumber);
    }
  }, [formData, setValue]);

  const handleNext = (data: FormData) => {
    const selectedSurveyLabel = surveyOptions.find(
      (option) => option.value === data.survey
    )?.label;

    // Dispatch the selected survey and respondents number to the Redux store
    dispatch(setSelectedSurvey(selectedSurveyLabel || ""));
    dispatch(setSelectedRespondentsNumber(data.respondentsNumber));

    // Close the survey dialog and open the purchase dialog
    dispatch(setSurveyDialog(false));
    dispatch(setPurchaseDialog(true));

    // Save the form data to the Redux store
    dispatch(setFormData(data));
  };

  const handlePurchaseCancel = () => {
    dispatch(setPurchaseDialog(false)); // Only close the dialog
    dispatch(setSurveyDialog(false));
  };

  const handlePurchaseProceed = () => {
    dispatch(setPurchaseDialog(false));
    dispatch(setConfirmDialog(true));
  };

  const handleConfirmCancel = () => {
    dispatch(setConfirmDialog(false));
    dispatch(resetDialogState());
    reset();
  };

  const handleConfirmProceed = () => {
    dispatch(setConfirmDialog(false));
    dispatch(setCongratulationsDialog(true));
  };

  const handleCongratulationsContinue = () => {
    dispatch(setCongratulationsDialog(false));
    dispatch(resetDialogState());
    reset();
    router.push("/shop");
  };

  const handleFilterRespondentsRedirect = (data: FormData) => {
    // Save the access state to session storage
    sessionStorage.setItem("allowFilterRespondentsAccess", "true");

    // Navigate to the filter respondents route
    router.push("/filter-respondents");

    const selectedSurveyLabel = surveyOptions.find(
      (option) => option.value === data.survey
    )?.label;

    // Dispatch the selected survey and respondents number to the Redux store
    dispatch(setSelectedSurvey(selectedSurveyLabel || ""));
    dispatch(setSelectedRespondentsNumber(data.respondentsNumber));

    // Close the survey dialog and open the purchase dialog
    dispatch(setSurveyDialog(false));
    dispatch(setPurchaseDialog(false));

    // Save the form data to the Redux store
    dispatch(setFormData(data));
  };

  // Wrapper function for the onClick handler
  const handleClick = () => {
    const data = {
      survey: watch("survey"), // Get the current value of the survey field
      respondentsNumber: watch("respondentsNumber"), // Get the current value of the respondentsNumber field
    };
    handleFilterRespondentsRedirect(data);
  };

  return (
    <div className="bg-[#FCFCFD] rounded-[11.72px] max-md:gap-6 max-w-[204px] py-2.5 border-[0.59px] flex flex-col justify-between h-full w-full">
      {pathname !== "/filter-respondents" && (
        <>
          <div className="w-full items-center justify-center flex mb-3">
            <div className="px-8 w-[127px] h-[127px] flex items-center justify-center relative">
              <Image
                src={'/assets/shop/svg/resp.svg'}
                alt="icons"
                layout="fill"
                className="object-contain"
              />
            </div>
          </div>

          <Dialog
            open={surveyDialog}
            onOpenChange={(open) => dispatch(setSurveyDialog(open))}
          >
            <DialogTrigger asChild>
              <div className="flex flex-col items-center justify-center px-3">
                <Button
                  variant="gradient"
                  className="h-[25px] gap-1 text-xs w-full"
                >
                  Respondents{" "}
                  <Image src={Arrow} alt="icons" className="size-4" />
                </Button>
              </div>
            </DialogTrigger>

            {/***** SURVEY DIALOG *****/}
            <DialogContent className="w-[90%] lg:max-w-[425px] min-h-auto bg-white border-0 outline-none px-5 lg:px-10 py-5 z-[1000000]">
              <form
                className="flex flex-col justify-center items-center gap-7"
                onSubmit={handleSubmit(handleNext)}
              >
                <h1 className="text-lg lg:text-2xl font-bold text-center">
                  Buy Respondents
                </h1>
                <div className="w-full flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="survey"
                        className="text-[#333333] text-sm"
                      >
                        Select Survey
                      </label>
                      <Controller
                        name="survey"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <SelectTrigger className="w-full h-auto border-2 border-[#E0E0E0] text-black text-sm rounded-md py-2 px-3 active:outline-none">
                              <SelectValue placeholder="Select Survey" />
                            </SelectTrigger>
                            <SelectContent className="w-full h-auto p-2 overflow-auto scrollbar-hide z-[1000000]">
                              <div className="w-full h-full flex flex-col gap-4 relative pt-8">
                                <input
                                  type="search"
                                  placeholder="Search surveys"
                                  className="w-[98%] h-auto py-1 px-2 border-2 border-[#E0E0E0] text-black text-sm rounded-md fixed top-1 left-1 bg-white z-10"
                                  value={searchSurvey}
                                  onChange={(e) =>
                                    setSearchSurvey(e.target.value)
                                  }
                                  autoFocus
                                />
                                <SelectGroup>
                                  {surveyOptions
                                    .filter((option) =>
                                      option.label
                                        .toLowerCase()
                                        .includes(searchSurvey.toLowerCase())
                                    )
                                    .map((item) => (
                                      <SelectItem
                                        className="text-black text-sm"
                                        key={item.value}
                                        value={item.value}
                                      >
                                        {item.label}
                                      </SelectItem>
                                    ))}
                                </SelectGroup>
                              </div>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.survey && (
                        <p className="text-red-500 text-sm">
                          {errors.survey.message}
                        </p>
                      )}
                    </div>
                    <p className="text-[10px] lg:text-xs">
                      Average Respondent rate per Survey:{" "}
                      <span className="font-semibold">500coins/Respondent</span>{" "}
                    </p>
                  </div>
                </div>

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
                        <span className="font-bold">
                          {respondentsNumber || 0}
                        </span>
                      </p>
                      <p className="text-[10px]  lg:text-xs">
                        Cost: <span className="font-bold">500 coins</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full flex items-center justify-center gap-5">
                  <Button
                    variant="default"
                    size="sm"
                    className={`w-full lg:w-1/2 bg-white text-black shadow-md shadow-[#563BFF42] hover:bg-transparent hover:scale-x-105 transition-all ${
                      surveyType && respondentsNumber ? "block" : "hidden"
                    }`}
                    type="button"
                    onClick={handleClick}
                  >
                    <span className="hidden lg:inline-block">
                      {" "}
                      Filter Respondents
                    </span>
                    <span className="inline-block lg:hidden text-xs">
                      Set Qualifying questions
                    </span>
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className={`${
                      surveyType && respondentsNumber ? "w-1/2" : "w-full"
                    } bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] shadow-[-5px_5px_10px_#563BFF42] hover:bg-purple-700 hover:scale-x-105 transition-all`}
                    type="submit"
                  >
                    <span
                      className={`${
                        surveyType && respondentsNumber
                          ? "hidden"
                          : "inline-block"
                      }`}
                    >
                      Next
                    </span>
                    <span
                      className={`${
                        surveyType && respondentsNumber
                          ? "inline-block"
                          : "hidden"
                      }`}
                    >
                      Finish
                    </span>
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </>
      )}

      {/***** PURCHASE DIALOG *****/}
      <Dialog
        open={purchaseDialog}
        onOpenChange={(open) => dispatch(setPurchaseDialog(open))}
      >
        <DialogContent className="w-[90%] md:max-w-[425px] min-h-auto bg-white border-0 outline-none px-5 lg:px-10 py-5 z-[1000000] flex flex-col justify-center items-center gap-7">
          <h1 className="text-lg lg:text-2xl font-bold text-center">
            Purchase Summary
          </h1>
          <div className="w-full h-auto flex flex-col gap-5">
            <div className="w-full flex flex-col gap-2">
              <p className="font-bold text-sm border-b-2 border-[#A9A9B1] border-dotted pb-2">
                Title of Survey
              </p>
              <p className="text-sm capitalize">{selectedSurvey}</p>{" "}
            </div>
            <p className="font-bold text-sm">Respondents:</p>
            <div className="w-full flex flex-col gap-7">
              <div className="w-full flex justify-between items-center border-b border-dotted border-[#A9A9B1] pb-2">
                <p className="text-xs lg:text-sm font-bold">
                  Total number of Respondents
                </p>
                <p className="text-base lg:text-lg text-[#5F08B2]">
                  {selectedRespondentsNumber}
                </p>{" "}
              </div>
              <div className="w-full flex justify-between items-center border-b border-dotted border-[#A9A9B1] pb-2">
                <p className="text-xs lg:text-sm font-bold">
                  Unit cost per Respondent
                </p>
                <p className="text-base lg:text-lg text-[#5F08B2]">
                  {selectedRespondentsNumber / 10}coins
                </p>
              </div>
              <div className="w-full flex justify-between items-center border-b border-dotted border-[#A9A9B1] pb-2">
                <p className="text-xs lg:text-sm font-bold">
                  Number of PollCoins
                </p>
                <p className="text-base lg:text-lg text-[#5F08B2]">
                  {selectedRespondentsNumber * 10}pc
                </p>
              </div>
            </div>
            <p className="text-[#898989] text-xs lg:text-sm">
              Are you sure you want to purchase the selected amount of
              Respondents for your Survey
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

      {/***** CONFIRM DIALOG *****/}
      <Dialog
        open={confirmDialog}
        onOpenChange={(open) => dispatch(setConfirmDialog(open))}
      >
        <DialogContent className="w-[90%] md:max-w-[425px] min-h-auto bg-white border-0 outline-none px-5 lg:px-10 py-5 z-[1000000] flex flex-col justify-center items-center gap-7">
          <Image src={confirm} width={150} height={150} alt="confirm" />
          <h1 className="text-base lg:text-2xl font-bold text-center">
            Confirm Purchase
          </h1>
          <p className="text-sm lg:text-base text-[#898989] text-center">
            Are you sure you want to purchase the selected amount of Respondents
            for your Survey
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
            >
              Proceed
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/***** CONGRATULATIONS DIALOG *****/}
      <Dialog
        open={congratulationsDialog}
        onOpenChange={(open) => dispatch(setCongratulationsDialog(open))}
      >
        <DialogContent className="w-[90%] md:max-w-[425px] min-h-auto bg-white border-0 outline-none px-5 lg:px-10 py-5 z-[1000000] flex flex-col justify-center items-center gap-5">
          <Image src={congrats} width={250} height={250} alt="congrats" />
          <h1 className="text-base lg:text-[28px] font-bold text-center text-[#333333]">
            Congratulations!
          </h1>
          <p className="text-sm lg:text-base text-[#898989] text-center">
            You have purchased {selectedRespondentsNumber} respondents for your
            survey
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
export default BuyRespondent;
