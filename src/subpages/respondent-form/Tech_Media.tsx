"use client";
import React, { FC, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IoArrowBack } from "react-icons/io5";
import ProgressBar from "@/components/respondent-form/ProgressBar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { techAndMediaSchema } from "@/utils/shema";
import { CombinedFormData } from "@/utils/combinedSchema";
import {
  contentOptions,
  platformOptions,
  browserOptions,
  internetUsageOptions,
  internetAccessOptions,
  socialMediaUsageOptions,
  PcOperatingSystemOptions,
  operatingSystemOptions,
} from "@/data/respondent-object-data";
import { useSubmitRespondentForm } from "@/hooks/useBecomePaidRespondent";
import { toast } from "react-toastify";
import { ControlledSelect } from "@/components/respondent-form/ControlledSelect";
import { ControlledMultiSelect } from "@/components/respondent-form/ControlledMultiSelect";
import { usePathname } from "next/navigation";

interface Props {
  onContinue: () => void;
  onPrevious: () => void;
  formData: CombinedFormData;
  setFormData: React.Dispatch<React.SetStateAction<CombinedFormData>>;
}

const Tech_Media: FC<Props> = ({
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
    resolver: zodResolver(techAndMediaSchema),
    defaultValues: formData,
  });

  useEffect(() => {
    reset(formData);
  }, [formData, reset]);

  const handleContinue = (data: z.infer<typeof techAndMediaSchema>) => {
    submitForm(
      { tab: "technologyMedia", formData: data },
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

  // useEffect(() => {
  //   if (isPending) {
  //     toast.info("Saving Technology & Media details...");
  //   }
  // }, [isPending]);

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    onPrevious();
  };

  return (
    <div className="w-full h-full flex flex-col items-center mx-auto">
      {pathname === "/respondent-form" && (
        <ProgressBar skip={true} progress={62.5} onContinue={onContinue} />
      )}
      <div className="flex flex-col gap-4 w-full lg:w-[70%] mx-auto">
        <div className="flex items-center gap-3">
          <IoArrowBack
            className="lg:hidden text-2xl"
            onClick={handlePrevious}
          />
          <h2 className="text-lg lg:text-2xl font-bold">
            Technology & Media Usage
          </h2>
        </div>
        <form
          className="flex flex-col gap-3"
          onSubmit={handleSubmit(handleContinue)}
        >
          <ControlledSelect
            name="internetUsage"
            control={control}
            options={internetUsageOptions}
            placeholder="Select option"
            label="Do you use the internet regularly?"
            error={errors.internetUsage}
            disabled={isPending}
          />

          <ControlledSelect
            name="internetAccess"
            control={control}
            options={internetAccessOptions}
            placeholder="Select option"
            label="How do you primarily access the internet?"
            error={errors.internetAccess}
            disabled={isPending}
            // otherFieldName="otherPrimaryAccess"
            register={register}
          />

          <ControlledSelect
            name="socialMediaUsage"
            control={control}
            options={socialMediaUsageOptions}
            placeholder="Select option"
            label="How often do you use social media?"
            error={errors.socialMediaUsage}
            disabled={isPending}
          />

          <ControlledMultiSelect
            name="contentEngagement"
            control={control}
            options={contentOptions}
            label="What type of content do you engage with the most? (Select all that apply)"
            placeholder="Select content types"
            error={errors.contentEngagement}
            disabled={isPending}
          />

          <h2 className="text-[#8A8A8A] text-xl fond-bold my-3">
            Addition Information
          </h2>

          <ControlledMultiSelect
            name="socialMediaPlatforms"
            control={control}
            options={platformOptions}
            label="What social media platform(s) do you use?"
            placeholder="Select platforms"
            error={errors.socialMediaPlatforms}
            disabled={isPending}
            contentHeight="300px"
          />

          <ControlledMultiSelect
            name="internetBrowsers"
            control={control}
            options={browserOptions}
            label="Which internet browser(s) do you use?"
            placeholder="Select browsers"
            error={errors.internetBrowsers}
            disabled={isPending}
          />

          <ControlledSelect
            name="computerOS"
            control={control}
            options={PcOperatingSystemOptions}
            placeholder="Select option"
            label="What computer operating system(s) do you use?"
            error={errors.computerOS}
            disabled={isPending}
            // otherFieldName="otherPcOperatingSystem"
            register={register}
          />

          <ControlledSelect
            name="mobile_operating_system"
            control={control}
            options={operatingSystemOptions}
            placeholder="Select option"
            label="What Smartphone operating system(s) do you use?"
            error={errors.smartphoneOS}
            disabled={isPending}
            // otherFieldName="otherMobileOperatingSystem"
            register={register}
          />

          <ControlledSelect
            name="tabletOS"
            control={control}
            options={operatingSystemOptions}
            placeholder="Select option"
            label="What tablet operating system(s) do you use?"
            error={errors.tabletOS}
            disabled={isPending}
            // otherFieldName="otherTabletOperatingSystem"
            register={register}
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

export default Tech_Media;
