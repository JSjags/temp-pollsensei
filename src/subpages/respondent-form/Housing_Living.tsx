"use client";
import React, { FC, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IoArrowBack } from "react-icons/io5";
import ProgressBar from "@/components/respondent-form/ProgressBar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { housingAndLivingSchema } from "@/utils/shema";
import { CombinedFormData } from "@/utils/combinedSchema";
import {
  livingConditionOptions,
  livingArrangementOptions,
  householdNumbersOptions,
} from "@/data/respondent-object-data";
import { useSubmitRespondentForm } from "@/hooks/useBecomePaidRespondent";
import { toast } from "react-toastify";
import { ControlledSelect } from "@/components/respondent-form/ControlledSelect";
import { usePathname } from "next/navigation";

interface Props {
  onContinue: () => void;
  onPrevious: () => void;
  formData: CombinedFormData;
  setFormData: React.Dispatch<React.SetStateAction<CombinedFormData>>;
}

const Housing_Living: FC<Props> = ({
  onContinue,
  onPrevious,
  formData,
  setFormData,
}) => {
  const { mutate: submitForm, isPending } = useSubmitRespondentForm();
  const pathname = usePathname();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(housingAndLivingSchema),
    defaultValues: formData,
  });

  useEffect(() => {
    reset(formData);
  }, [formData, reset]);

  const handleContinue = (data: z.infer<typeof housingAndLivingSchema>) => {
    submitForm(
      { tab: "housingLiving", formData: data },
      {
        onSuccess: () => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            ...data,
          }));
          onContinue();
        },
        onError: (error) => {
          console.error("Form submission error:", error);
          toast.error(error.message);
        },
      }
    );
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    onPrevious();
  };

  return (
    <div className="w-full h-full flex flex-col items-center mx-auto">
      {pathname === "/respondent-form" && (
        <ProgressBar skip={true} progress={75} onContinue={onContinue} />
      )}
      <div className="flex flex-col gap-4 w-full lg:w-[70%] mx-auto">
        <div className="flex items-center gap-3">
          <IoArrowBack
            className="lg:hidden text-2xl"
            onClick={handlePrevious}
          />
          <h2 className="text-lg lg:text-2xl font-bold">
            Housing & Living Situation
          </h2>
        </div>
        <form
          className="flex flex-col gap-3"
          onSubmit={handleSubmit(handleContinue)}
        >
          <ControlledSelect
            name="livingArrangement"
            control={control}
            options={livingConditionOptions}
            placeholder="Select option"
            label="What is your current living arrangement?"
            error={errors.livingArrangement}
            disabled={isPending}
            register={register}
          />

          <ControlledSelect
            name="homeOwnership"
            control={control}
            options={livingArrangementOptions}
            placeholder="Select option"
            label="Do you own or rent your home?"
            error={errors.homeOwnership}
            disabled={isPending}
            register={register}
          />

          <ControlledSelect
            name="householdSize"
            control={control}
            options={householdNumbersOptions}
            placeholder="Select option"
            label="How many people live in your household?"
            error={errors.householdSize}
            disabled={isPending}
          />

          <div className="w-full flex items-center gap-5 lg:mb-10 mt-5">
            <Button
              size="default"
              variant="outline"
              className="w-full md:w-full bg-transparent border-[#A9A9B1] rounded-md text-xs md:text-sm p-4 hover:scale-x-105 transition-all text-black"
              onClick={handlePrevious}
            >
              Previous
            </Button>
            <Button
              size="default"
              className="w-full md:w-full bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] shadow-[-5px_5px_10px_#563BFF42] hover:bg-purple-700 rounded-md text-xs md:text-sm p-4 hover:scale-x-105 transition-all"
              type="submit"
              disabled={isPending}
            >
              {isPending
                ? "Saving..."
                : pathname === "/respondent-form"
                ? "Next"
                : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Housing_Living;
