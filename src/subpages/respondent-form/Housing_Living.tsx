"use client";
import React, { FC, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IoArrowBack } from "react-icons/io5";
import ProgressBar from "@/components/respondent-form/ProgressBar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { housingAndLivingSchema } from "@/utils/shema";
import {
  livingConditionOptions,
  livingArrangementOptions,
  householdNumbersOptions,
} from "@/data/respondent-object-data";
import { useSubmitRespondentForm } from "@/hooks/useBecomePaidRespondent";
import { toast } from "react-toastify";
import { ControlledSelect } from "@/components/respondent-form/ControlledSelect";

interface Props {
  onContinue: () => void;
  onPrevious: () => void;
}

const Housing_Living: FC<Props> = ({ onContinue, onPrevious }) => {
  const { mutate: submitForm, isPending } = useSubmitRespondentForm();

  const handleContinue = (data: FormData) => {
    submitForm(
      { tab: "housingLiving", formData: data },
      {
        onSuccess: () => {
          onContinue();
        },
        onError: (error) => {
          console.error("Form submission error:", error);
          toast.error(error.message);
        },
      }
    );
  };

  useEffect(() => {
    if (isPending) {
      toast.info("Saving Housing & Living Situation details...");
    }
  }, [isPending]);

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    onPrevious();
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(housingAndLivingSchema),
  });

  type FormData = z.infer<typeof housingAndLivingSchema>;

  return (
    <div className="w-full h-full flex flex-col items-center mx-auto">
      <ProgressBar skip={true} progress={75} onContinue={onContinue} />
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
            name="living_arrangement"
            control={control}
            options={livingConditionOptions}
            placeholder="Select option"
            label="What is your current living arrangement?"
            required
            error={errors.living_arrangement}
            disabled={isPending}
            otherFieldName="otherLivingArrangement"
            register={register}
          />

          <ControlledSelect
            name="home_status"
            control={control}
            options={livingArrangementOptions}
            placeholder="Select option"
            label="Do you own or rent your home?"
            required
            error={errors.home_status}
            disabled={isPending}
            otherFieldName="otherHomeStatus"
            register={register}
          />

          <ControlledSelect
            name="household"
            control={control}
            options={householdNumbersOptions}
            placeholder="Select option"
            label="How many people live in your household?"
            required
            error={errors.household}
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
              {isPending ? "Saving..." : "Next"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Housing_Living;
