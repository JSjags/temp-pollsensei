"use client";
import React, { FC, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IoArrowBack } from "react-icons/io5";
import ProgressBar from "@/components/respondent-form/ProgressBar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { educationAndEmploymentSchema } from "@/utils/shema";
import {
  educationLevelOptions,
  employmentStatusOptions,
  industryOptions,
  jobRoleOptions,
  workingHoursOptions,
  incomeOptions,
  savvyOptions,
} from "@/data/respondent-object-data";
import { useSubmitRespondentForm } from "@/hooks/useBecomePaidRespondent";
import { toast } from "react-toastify";
import { ControlledSelect } from "@/components/respondent-form/ControlledSelect";

interface Props {
  onContinue: () => void;
  onPrevious: () => void;
}

const Edu_Employment: FC<Props> = ({ onContinue, onPrevious }) => {
  const { mutate: submitForm, isPending } = useSubmitRespondentForm();

  const handleContinue = (data: FormData) => {
    submitForm(
      { tab: "educationEmployment", formData: data },
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
      toast.info("Saving Education & Employment details...");
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
    resolver: zodResolver(educationAndEmploymentSchema),
  });

  type FormData = z.infer<typeof educationAndEmploymentSchema>;

  return (
    <div className="w-full h-full flex flex-col items-center mx-auto">
      <ProgressBar skip={true} progress={37.5} onContinue={onContinue} />
      <div className="flex flex-col gap-4 w-full lg:w-[70%] mx-auto">
        <div className="flex items-center gap-3">
          <IoArrowBack
            className="lg:hidden text-2xl"
            onClick={handlePrevious}
          />
          <h2 className="text-lg lg:text-2xl font-bold">
            Education & Employment
          </h2>
        </div>
        <form
          className="flex flex-col gap-3"
          onSubmit={handleSubmit(handleContinue)}
        >
          <ControlledSelect
            name="education_level"
            control={control}
            options={educationLevelOptions}
            placeholder="Select highest level of education"
            label="What is your highest level of education?"
            error={errors.education_level}
            disabled={isPending}
          />

          <ControlledSelect
            name="employment_status"
            control={control}
            options={employmentStatusOptions}
            placeholder="Select employment status"
            label="What is your current employment status?"
            error={errors.employment_status}
            disabled={isPending}
          />

          <ControlledSelect
            name="employment_industry"
            control={control}
            options={industryOptions}
            placeholder="Select employment Industry"
            label="Employment industry"
            error={errors.employment_industry}
            disabled={isPending}
          />

          <ControlledSelect
            name="job_role"
            control={control}
            options={jobRoleOptions}
            placeholder="Select job role"
            label="What is your job role?"
            error={errors.job_role}
            disabled={isPending}
            otherFieldName="otherJob"
            register={register}
          />

          <ControlledSelect
            name="working_hours"
            control={control}
            options={workingHoursOptions}
            placeholder="Select average weekly working hours"
            label="What is your average working hours per week?"
            error={errors.working_hours}
            disabled={isPending}
          />

          <ControlledSelect
            name="income_range"
            control={control}
            options={incomeOptions}
            placeholder="Select Household income range"
            label="What is your household income range?"
            error={errors.income_range}
            disabled={isPending}
          />

          <ControlledSelect
            name="tech_savvy"
            control={control}
            options={savvyOptions}
            placeholder="Select tech savvy level"
            label="Are you tech savvy?"
            error={errors.tech_savvy}
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

export default Edu_Employment;
