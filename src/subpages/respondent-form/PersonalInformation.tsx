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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { IoChevronDownOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { IoClose } from "react-icons/io5";
import { Checkbox } from "@/components/ui/shadcn-checkbox";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { personalInformationSchema } from "@/utils/shema";
import ProgressBar from "@/components/respondent-form/ProgressBar";
import {
  petOptions,
  genderOptions,
  marriageStatusOptions,
  ageGroupOptions,
  dependentsOptions,
} from "@/data/respondent-object-data";

interface Props {
  onContinue: () => void;
}

const PersonalInformation: FC<Props> = ({ onContinue }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(personalInformationSchema),
    defaultValues: {
      pets: [],
    },
  });

  type FormData = z.infer<typeof personalInformationSchema>;
  // function to handle pet selection
  const handlePetChange = (field: any, pet: string, checked: boolean) => {
    const updatedPets = checked
      ? [...field.value, pet]
      : field.value.filter((p: string) => p !== pet);
    field.onChange(updatedPets);
  };

  // function to remove selected pet(s)
  const removePet = (field: any, pet: string) => {
    const updatedPets = field.value.filter((p: string) => p !== pet);
    field.onChange(updatedPets);
  };

  // function to handle the next tab/section
  const handleContinue = (data: FormData) => {
    onContinue();
    // console.log({ data });
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
          <div className="flex flex-col gap-2">
            <label htmlFor="firstName" className="text-[#333333] text-sm">
              First Name (Required)
            </label>
            <input
              type="text"
              id="firstName"
              placeholder="Enter name"
              className="w-full h-auto border-2 border-[#E0E0E0] text-[#898989] text-base rounded-md py-2 px-3 active:outline-none"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="lastName" className="text-[#333333] text-sm">
              Last Name/Surname (Required)
            </label>
            <input
              type="text"
              id="lastName"
              placeholder="Enter lastname"
              className="w-full h-auto border-2 border-[#E0E0E0] text-[#898989] text-base rounded-md py-2 px-3 active:outline-none"
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="otherName" className="text-[#333333] text-sm">
              Other Name (Optional)
            </label>
            <input
              type="text"
              id="otherName"
              placeholder="Enter lastname"
              className="w-full h-auto border-2 border-[#E0E0E0] text-[#898989] text-base rounded-md py-2 px-3 active:outline-none"
              {...register("otherName")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-[#333333] text-sm">
              Email Address (Required)
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className="w-full h-auto border-2 border-[#E0E0E0] text-[#898989] text-base rounded-md py-2 px-3 active:outline-none"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-[#333333] text-sm">
              Phone number (Required)
            </label>
            <input
              type="tel"
              id="phone"
              placeholder="Enter name"
              className="w-full h-auto border-2 border-[#E0E0E0] text-[#898989] text-base rounded-md py-2 px-3 active:outline-none"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="gender" className="text-[#333333] text-sm">
              What is your gender? (Required)
            </label>
            <Controller
              name="gender"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-full h-auto border-2 border-[#E0E0E0] text-[#898989] text-sm rounded-md py-2 px-3 active:outline-none">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="w-full h-auto">
                      {genderOptions.map((option) => (
                        <SelectItem
                          value={option.value}
                          className="text-base"
                          key={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {field.value === "other" && (
                    <input
                      type="text"
                      placeholder="Other (Please specify)"
                      className="w-full h-auto px-2 py-1 border-2 border-[#E0E0E0] text-[#898989] text-sm rounded-md mt-2"
                      {...register("otherGender")}
                      autoFocus
                    />
                  )}
                </>
              )}
            />
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="maritalStatus" className="text-[#333333] text-sm">
              What is your marital status? (Required)
            </label>
            <Controller
              name="maritalStatus"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger className="w-full h-auto border-2 border-[#E0E0E0] text-[#898989] text-sm rounded-md py-2 px-3 active:outline-none">
                    <SelectValue placeholder="Select Marital Status" />
                  </SelectTrigger>
                  <SelectContent className="w-full h-auto">
                    <SelectGroup>
                      {marriageStatusOptions.map((option) => (
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
            {errors.maritalStatus && (
              <p className="text-red-500 text-sm">
                {errors.maritalStatus.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="ageGroup" className="text-[#333333] text-sm">
              What is your age group? (Required)
            </label>
            <Controller
              name="ageGroup"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger className="w-full h-auto border-2 border-[#E0E0E0] text-[#898989] text-sm rounded-md py-2 px-3 active:outline-none">
                    <SelectValue placeholder="Select Age Group" />
                  </SelectTrigger>
                  <SelectContent className="w-full h-auto">
                    <SelectGroup>
                      {ageGroupOptions.map((option) => (
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
            {errors.ageGroup && (
              <p className="text-red-500 text-sm">{errors.ageGroup.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="dependents" className="text-[#333333] text-sm">
              Do you have children or dependents? (Required)
            </label>
            <Controller
              name="dependents"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger className="w-full h-auto border-2 border-[#E0E0E0] text-[#898989] text-sm rounded-md py-2 px-3 active:outline-none">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent className="w-full h-auto">
                    <SelectGroup>
                      {dependentsOptions.map((option) => (
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
            {errors.dependents && (
              <p className="text-red-500 text-sm">
                {errors.dependents.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="maritalStatus" className="text-[#333333] text-sm">
              Pets Owned (You can select more than one pet)
            </label>
            <Controller
              name="pets"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      className="w-full h-auto border-2 border-[#E0E0E0] text-[#898989] text-sm rounded-md py-2 px-3 active:outline-none"
                    >
                      <Button
                        variant="outline"
                        size="default"
                        className="w-full flex items-center justify-between"
                      >
                        <span>Select Option</span>
                        <IoChevronDownOutline className="text-[#898989] text-lg" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[450px] flex flex-col">
                      {petOptions.map((pet) => (
                        <div
                          key={pet}
                          className="flex items-center gap-2 w-full hover:bg-[#CB85FD1A] px-5 rounded-sm"
                        >
                          <Checkbox
                            id={pet}
                            checked={field.value.includes(pet)}
                            onCheckedChange={(checked) =>
                              handlePetChange(field, pet, !!checked)
                            }
                          />
                          <DropdownMenuLabel className="text-base capitalize font-normal">
                            {pet}
                          </DropdownMenuLabel>
                        </div>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="flex flex-wrap gap-2">
                    {field.value.map((pet: string) => (
                      <div
                        key={pet}
                        className={`flex items-center gap-1 bg-[#E8DEF8] rounded-xl py-1 px-2 ${
                          pet.includes("other") ? "hidden" : "inline-block"
                        }`}
                      >
                        <span className="text-sm capitalize">{pet}</span>
                        <IoClose
                          className="text-lg cursor-pointer"
                          onClick={() => removePet(field, pet)}
                        />
                      </div>
                    ))}
                  </div>

                  {field.value.includes("other") && (
                    <input
                      type="text"
                      placeholder="Other (Please specify)"
                      className="w-full h-auto px-2 py-1 border-2 border-[#E0E0E0] text-[#898989] text-sm rounded-md mt-2"
                      {...register("otherPet")}
                      autoFocus
                    />
                  )}
                </>
              )}
            />
            {errors.pets && (
              <p className="text-red-500 text-sm">{errors.pets.message}</p>
            )}
          </div>
          <Button
            size="default"
            type="submit"
            className="w-full md:w-auto bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] shadow-[-5px_5px_10px_#563BFF42] hover:bg-purple-700 rounded-md text-xs md:text-sm p-4 hover:scale-x-105 transition-all lg:mb-10 mt-5"
          >
            Save and Continue
          </Button>
        </form>
      </div>
    </div>
  );
};
export default PersonalInformation;
