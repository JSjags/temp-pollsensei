import React, { FC } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { personalInformationSchema } from "@/utils/shema";
import { CombinedFormData } from "@/utils/combinedSchema";
import ProgressBar from "@/components/respondent-form/ProgressBar";
import {
  petOptions,
  genderOptions,
  marriageStatusOptions,
  ageGroupOptions,
  dependentsOptions,
} from "@/data/respondent-object-data";
import { useSubmitRespondentForm } from "@/hooks/useBecomePaidRespondent";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/respondent-form/FormInput";
import { ControlledSelect } from "@/components/respondent-form/ControlledSelect";
import { ControlledMultiSelect } from "@/components/respondent-form/ControlledMultiSelect";

interface Props {
  onContinue: () => void;
  formData: CombinedFormData;
  setFormData: React.Dispatch<React.SetStateAction<CombinedFormData>>;
}

const PersonalInformation: FC<Props> = ({
  onContinue,
  formData,
  setFormData,
}) => {
  const user = useSelector((state: RootState) => state.user.user);
  const nameParts = user?.name?.split(" ") || [];
  const firstName = nameParts[0] || "";
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
  const otherName =
    nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "";
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(personalInformationSchema),
    defaultValues: {
      firstName: firstName,
      lastName: lastName,
      otherName: otherName,
      email: user?.email || "",
      phoneNumber: formData.phoneNumber || "",
      gender: formData.gender || "",
      maritalStatus: formData.maritalStatus || "",
      ageGroup: formData.ageGroup || "",
      dependents: formData.dependents || "",
      pets: formData.pets || [],
      otherPet: formData.otherPet || "",
    },
  });

  const { mutate: submitForm, isPending } = useSubmitRespondentForm();

  const handleContinue = (data: z.infer<typeof personalInformationSchema>) => {
    submitForm(
      { tab: "personalInfo", formData: data },
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

  return (
    <div className="w-full h-full flex flex-col items-start mx-auto">
      <ProgressBar skip={false} progress={12.5} onContinue={onContinue} />
      <div className="flex flex-col gap-4 w-full lg:w-[70%] mx-auto">
        <div className="flex flex-col gap-3">
          <h2 className="text-lg lg:text-2xl font-bold">
            Basic Personal Information
          </h2>
          <div className="border-l-4 border-[#5B03B29E] pl-3 w-[90%]">
            <p className="text-sm text-[#898989]">
              Researchers often look for people who match certain demographic
              groups. This information will help us link you to studies that are
              most relevant to you.
            </p>
          </div>
        </div>
        <form
          className="flex flex-col gap-3"
          onSubmit={handleSubmit(handleContinue)}
        >
          <FormInput
            id="firstName"
            label="First Name"
            placeholder="Enter name"
            register={register}
            error={errors.firstName}
            required
            disabled={isPending}
          />

          <FormInput
            id="lastName"
            label="Last Name/Surname"
            placeholder="Enter lastname"
            register={register}
            error={errors.lastName}
            required
            disabled={isPending}
          />

          <FormInput
            id="otherName"
            label="Other Name (Optional)"
            placeholder="Enter other name"
            register={register}
            error={errors.otherName}
            disabled={isPending}
          />

          <FormInput
            id="email"
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            register={register}
            error={errors.email}
            required
            disabled={isPending}
          />

          <FormInput
            id="phoneNumber"
            label="Phone number"
            type="tel"
            placeholder="Enter phone number"
            register={register}
            error={errors.phoneNumber}
            required
            disabled={isPending}
          />

          <ControlledSelect
            name="gender"
            control={control}
            options={genderOptions}
            placeholder="Select gender"
            label="What is your gender?"
            error={errors.gender}
            required
            disabled={isPending}
          />

          <ControlledSelect
            name="maritalStatus"
            control={control}
            options={marriageStatusOptions}
            placeholder="Select Marital Status"
            label="What is your marital status?"
            error={errors.maritalStatus}
            required
            disabled={isPending}
          />

          <ControlledSelect
            name="ageGroup"
            control={control}
            options={ageGroupOptions}
            placeholder="Select Age Group"
            label="What is your age group?"
            error={errors.ageGroup}
            required
            disabled={isPending}
          />

          <ControlledSelect
            name="dependents"
            control={control}
            options={dependentsOptions}
            placeholder="Select option"
            label="Do you have children or dependents?"
            error={errors.dependents}
            required
            disabled={isPending}
          />

          <ControlledMultiSelect
            name="pets"
            control={control}
            options={petOptions}
            label="Pets Owned (You can select more than one pet)"
            error={errors.pets}
            disabled={isPending}
            otherFieldName="otherPet"
            register={register}
          />

          <Button
            size="default"
            type="submit"
            className="w-full md:w-auto bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] shadow-[-5px_5px_10px_#563BFF42] hover:bg-purple-700 rounded-md text-xs md:text-sm p-4 hover:scale-x-105 transition-all lg:mb-10 mt-5"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save and Continue"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PersonalInformation;
