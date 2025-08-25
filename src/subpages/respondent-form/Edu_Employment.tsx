"use client";
import React, { FC, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IoArrowBack } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { educationAndEmploymentSchema } from "@/utils/shema";
import { CombinedFormData } from "@/utils/combinedSchema";
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
import { usePathname } from "next/navigation";

interface Props {
  onContinue: () => void;
  onPrevious: () => void;
  formData: CombinedFormData;
  setFormData: React.Dispatch<React.SetStateAction<CombinedFormData>>;
}

const Edu_Employment: FC<Props> = ({
  onContinue,
  onPrevious,
  formData,
  setFormData,
}) => {
  const { mutate: submitForm, isPending } = useSubmitRespondentForm();
  const pathname = usePathname();

  // Filter formData to only include fields relevant to this form
  const relevantFormData = {
    educationLevel: formData.educationLevel,
    employmentStatus: formData.employmentStatus,
    industry: formData.industry,
    jobRole: formData.jobRole,
    workingHours: formData.workingHours,
    incomeRange: formData.incomeRange,
    techSavvy: formData.techSavvy,
    otherIndustry: formData.otherIndustry,
    otherJob: formData.otherIndustry,
  };

  // console.log('Edu_Employment - Relevant form data:', relevantFormData);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(educationAndEmploymentSchema),
    defaultValues: relevantFormData,
  });

  // Watch form values for debugging
  const watchedValues = watch();
  console.log("Current form values:", {
    educationLevel: watchedValues.educationLevel,
    employmentStatus: watchedValues.employmentStatus,
    industry: watchedValues.industry,
    jobRole: watchedValues.jobRole,
    workingHours: watchedValues.workingHours,
    incomeRange: watchedValues.incomeRange,
    techSavvy: watchedValues.techSavvy,
  });

  // Reset form when relevant formData changes
  useEffect(() => {
    console.log("Resetting form with relevant data:", relevantFormData);
    reset(relevantFormData);
  }, [
    formData.educationLevel,
    formData.employmentStatus,
    formData.industry,
    formData.jobRole,
    formData.workingHours,
    formData.incomeRange,
    formData.techSavvy,
    formData.otherIndustry,
    formData.otherIndustry,
    reset,
  ]);

  const handleContinue = (
    data: z.infer<typeof educationAndEmploymentSchema>
  ) => {
    console.log("Form submitted with data:", data);
    submitForm(
      { tab: "educationEmployment", formData: data },
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
            name="educationLevel"
            control={control}
            options={educationLevelOptions}
            placeholder="Select highest level of education"
            label="What is your highest level of education?"
            error={errors.educationLevel}
            disabled={isPending}
          />

          <ControlledSelect
            name="employmentStatus"
            control={control}
            options={employmentStatusOptions}
            placeholder="Select employment status"
            label="What is your current employment status?"
            error={errors.employmentStatus}
            disabled={isPending}
          />

          <ControlledSelect
            name="industry"
            control={control}
            options={industryOptions}
            placeholder="Select employment Industry"
            label="Employment industry"
            error={errors.industry}
            disabled={isPending}
            otherFieldName="otherIndustry"
            register={register}
          />

          <ControlledSelect
            name="jobRole"
            control={control}
            options={jobRoleOptions}
            placeholder="Select job role"
            label="What is your job role?"
            error={errors.jobRole}
            disabled={isPending}
            otherFieldName="otherJob"
            register={register}
          />

          <ControlledSelect
            name="workingHours"
            control={control}
            options={workingHoursOptions}
            placeholder="Select average weekly working hours"
            label="What is your average working hours per week?"
            error={errors.workingHours}
            disabled={isPending}
          />

          <ControlledSelect
            name="incomeRange"
            control={control}
            options={incomeOptions}
            placeholder="Select Household income range"
            label="What is your household income range?"
            error={errors.incomeRange}
            disabled={isPending}
          />

          <ControlledSelect
            name="techSavvy"
            control={control}
            options={savvyOptions}
            placeholder="Select tech savvy level"
            label="Are you tech savvy?"
            error={errors.techSavvy}
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

export default Edu_Employment;
