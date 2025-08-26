"use client";
import React, { FC, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IoArrowBack } from "react-icons/io5";
import ProgressBar from "@/components/respondent-form/ProgressBar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { healthAndLifestyleSchema } from "@/utils/shema";
import { CombinedFormData } from "@/utils/combinedSchema";
import {
  overallHealthOptions,
  helathInsuranceOptions,
  healthConditionOptions,
  physicalActivityOptions,
  dietryOptions,
  smokeOptions,
  drinkOptions,
  sleepOptions,
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

const Health_Lifestyle: FC<Props> = ({
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
    resolver: zodResolver(healthAndLifestyleSchema),
    defaultValues: formData,
  });

  // Reset form when formData changes
  useEffect(() => {
    reset(formData);
  }, [formData, reset]);

  const handleContinue = (data: z.infer<typeof healthAndLifestyleSchema>) => {
    submitForm(
      { tab: "healthLifestyle", formData: data },
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
        <ProgressBar skip={true} progress={50} onContinue={onContinue} />
      )}
      <div className="flex flex-col gap-4 w-full lg:w-[70%] mx-auto">
        <div className="flex items-center gap-3">
          <IoArrowBack
            className="lg:hidden text-2xl"
            onClick={handlePrevious}
          />
          <h2 className="text-lg lg:text-2xl font-bold">
            Health & Lifestyle Markers
          </h2>
        </div>
        <form
          className="flex flex-col gap-3"
          onSubmit={handleSubmit(handleContinue)}
        >
          <ControlledSelect
            name="overallHealth"
            control={control}
            options={overallHealthOptions}
            placeholder="Select option"
            label="How would you describe your overall health?"
            error={errors.overallHealth}
            disabled={isPending}
          />

          <ControlledSelect
            name="healthInsurance"
            control={control}
            options={helathInsuranceOptions}
            placeholder="Select option"
            label="Health Insurance Type"
            error={errors.healthInsurance}
            disabled={isPending}
            otherFieldName="otherHealthInsurance"
            register={register}
          />

          <ControlledSelect
            name="chronicConditions"
            control={control}
            options={healthConditionOptions}
            placeholder="Select option"
            label="Do you have any chronic health conditions?"
            error={errors.chronicConditions}
            disabled={isPending}
            otherFieldName="otherHealthCondition"
            register={register}
          />

          <ControlledSelect
            name="physicalActivity"
            control={control}
            options={physicalActivityOptions}
            placeholder="Select option"
            label="Do you engage in regular physical activity?"
            error={errors.physicalActivity}
            disabled={isPending}
          />

          <ControlledSelect
            name="dietaryRestrictions"
            control={control}
            options={dietryOptions}
            placeholder="Select option"
            label="Do you have any dietary restrictions or preferences?"
            error={errors.dietaryRestrictions}
            disabled={isPending}
            otherFieldName="otherDietryRestrictions"
            register={register}
          />

          <ControlledSelect
            name="tobaccoUse"
            control={control}
            options={smokeOptions}
            placeholder="Select option"
            label="Do you smoke or use tobacco products?"
            error={errors.tobaccoUse}
            disabled={isPending}
          />

          <ControlledSelect
            name="alcoholUse"
            control={control}
            options={drinkOptions}
            placeholder="Select option"
            label="Do you consume alcohol?"
            error={errors.alcoholUse}
            disabled={isPending}
          />

          <ControlledSelect
            name="sleepHours"
            control={control}
            options={sleepOptions}
            placeholder="Select option"
            label="How many hours of sleep do you get on average per night?"
            error={errors.sleepHours}
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

export default Health_Lifestyle;
