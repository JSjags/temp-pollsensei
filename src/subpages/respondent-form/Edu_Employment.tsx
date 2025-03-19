"use client";
import React, { FC } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { IoArrowBack } from "react-icons/io5";
import ProgressBar from "@/components/respondent-form/ProgressBar";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { educationAndEmploymentSchema } from "@/utils/shema";
import {
  educationLevelOptions,
  employentStatusOptions,
  industryOptions,
  jobRoleOptions,
  workingHoursOptions,
  incomeOptions,
  savvyOptions,
} from "@/data/respondent-object-data";

interface Props {
  onContinue: () => void;
  onPrevious: () => void;
}

const Edu_Employment: FC<Props> = ({ onContinue, onPrevious }) => {
  // function to handle the next tab/section
  const handleContinue = (data: FormData) => {
    onContinue();
  };

  // function to handle the previous tab/section
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
          <div className="flex flex-col gap-2">
            <label htmlFor="education" className="text-[#333333] text-sm">
              What is your highest level of education?
            </label>
            <Controller
              name="education_level"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger className="w-full h-auto border-2 border-[#E0E0E0] text-[#898989] text-sm rounded-md py-2 px-3 active:outline-none">
                    <SelectValue placeholder="Select highest level of education" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectGroup>
                      {educationLevelOptions.map((option) => (
                        <SelectItem
                          value={option.value}
                          className="text-base"
                          key={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="employment" className="text-[#333333] text-sm">
              What is your current employment status?
            </label>
            <Controller
              name="employment_status"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger className="w-full h-auto border-2 border-[#E0E0E0] text-[#898989] text-sm rounded-md py-2 px-3 active:outline-none">
                    <SelectValue placeholder="Select employment status" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectGroup>
                      {employentStatusOptions.map((option) => (
                        <SelectItem
                          value={option.value}
                          className="text-base"
                          key={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="nationality" className="text-[#333333] text-sm">
              Employment industry
            </label>
            <Controller
              name="employment_industry"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger className="w-full h-auto border-2 border-[#E0E0E0] text-[#898989] text-sm rounded-md py-2 px-3 active:outline-none">
                    <SelectValue placeholder="Select employment Industry" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectGroup>
                      {industryOptions.map((option) => (
                        <SelectItem
                          value={option.value}
                          className="text-base"
                          key={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="role" className="text-[#333333] text-sm">
              What is your job role?
            </label>
            <Controller
              name="job_role"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-full h-auto border-2 border-[#E0E0E0] text-[#898989] text-sm rounded-md py-2 px-3 active:outline-none">
                      <SelectValue placeholder="Select job role" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectGroup>
                        {jobRoleOptions.map((option) => (
                          <SelectItem
                            value={option.value}
                            className="text-base"
                            key={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  {field.value === "other" && (
                    <input
                      type="text"
                      placeholder="Other (Please specify)"
                      className="w-full h-auto px-2 py-1 border-2 border-[#E0E0E0] text-[#898989] text-sm rounded-md mt-2"
                      {...register("otherJob")}
                      autoFocus
                    />
                  )}
                </>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="workHours" className="text-[#333333] text-sm">
              What is your average working hours per week?
            </label>
            <Controller
              name="working_hours"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger className="w-full h-auto border-2 border-[#E0E0E0] text-[#898989] text-sm rounded-md py-2 px-3 active:outline-none">
                    <SelectValue placeholder="Select average weekly working hours" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectGroup>
                      {workingHoursOptions.map((option) => (
                        <SelectItem
                          value={option.value}
                          className="text-base"
                          key={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="incomeRange" className="text-[#333333] text-sm">
              What is your household income range?
            </label>
            <Controller
              name="income_range"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger className="w-full h-auto border-2 border-[#E0E0E0] text-[#898989] text-sm rounded-md py-2 px-3 active:outline-none">
                    <SelectValue placeholder="Select Household income range" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectGroup>
                      {incomeOptions.map((option) => (
                        <SelectItem
                          value={option.value}
                          className="text-base"
                          key={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="savvy" className="text-[#333333] text-sm">
              Are you tech savyy?
            </label>
            <Controller
              name="tech_savvy"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger className="w-full h-auto border-2 border-[#E0E0E0] text-[#898989] text-sm rounded-md py-2 px-3 active:outline-none">
                    <SelectValue placeholder="Select languages" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectGroup>
                      {savvyOptions.map((option) => (
                        <SelectItem
                          value={option.value}
                          className="text-base"
                          key={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
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
            >
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Edu_Employment;
