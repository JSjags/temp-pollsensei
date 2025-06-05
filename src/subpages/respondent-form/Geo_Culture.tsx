"use client";
import React, { FC, useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { IoArrowBack } from "react-icons/io5";
import ProgressBar from "@/components/respondent-form/ProgressBar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { geographyAndCultureSchema } from "@/utils/shema";
import { CombinedFormData } from "@/utils/combinedSchema";
import { useQuery } from "@tanstack/react-query";
import { getNationality } from "@/services/api/apiRequest";
import Image from "next/image";
import {
  languagesOptions,
  locationOptions,
  regionOptions,
  ethnicityOptions,
  religionOptions,
} from "@/data/respondent-object-data";
import { useSubmitRespondentForm } from "@/hooks/useBecomePaidRespondent";
import { toast } from "react-toastify";
import { ControlledSelect } from "@/components/respondent-form/ControlledSelect";
import { ControlledMultiSelect } from "@/components/respondent-form/ControlledMultiSelect";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import { APP_KEYS } from "@/constants";

interface Props {
  onContinue: () => void;
  onPrevious: () => void;
  formData: CombinedFormData;
  setFormData: React.Dispatch<React.SetStateAction<CombinedFormData>>;
}

const Geo_Culture: FC<Props> = ({
  onContinue,
  onPrevious,
  formData,
  setFormData,
}) => {
  const [searchNationality, setSearchNationality] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(geographyAndCultureSchema),
    defaultValues: formData,
  });

  const { mutate: submitForm, isPending } = useSubmitRespondentForm();

  const handleContinue = (data: z.infer<typeof geographyAndCultureSchema>) => {
    submitForm(
      { tab: "geographicInfo", formData: data },
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

  const { data: nationalities } = useQuery({
    queryKey: [...[APP_KEYS.COUNTRY_FLAG]],
    queryFn: async () => getNationality(),
    enabled: true,
  });

  const sortedNationalities = nationalities
    ? [...nationalities].sort((a, b) =>
        a.name.common.localeCompare(b.name.common)
      )
    : [];

  const filteredNationalities = sortedNationalities.filter((nationality) =>
    nationality.name.common
      .toLowerCase()
      .includes(searchNationality.toLowerCase())
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchNationality]);

  return (
    <div className="w-full h-full flex flex-col items-center mx-auto">
      <ProgressBar skip={false} progress={25} onContinue={onContinue} />
      <div className="flex flex-col gap-4 w-full lg:w-[70%] mx-auto">
        <div className="flex items-center gap-3">
          <IoArrowBack
            className="lg:hidden text-2xl"
            onClick={handlePrevious}
          />
          <h2 className="text-lg lg:text-2xl font-bold">
            Geographic & Cultural Information
          </h2>
        </div>

        <form
          className="flex flex-col gap-3"
          onSubmit={handleSubmit(handleContinue)}
        >
          <ControlledSelect
            name="currentLocation"
            control={control}
            options={locationOptions}
            placeholder="Select option"
            label="Where do you currently live?"
            required={true}
            error={errors.currentLocation}
            disabled={isPending}
            // otherFieldName="otherLocation"
            register={register}
          />

          <ControlledSelect
            name="region"
            control={control}
            options={regionOptions}
            placeholder="Select option"
            label="Which region do you live in?"
            required={true}
            error={errors.region}
            disabled={isPending}
            // otherFieldName="otherRegion"
            register={register}
          />

          <div className="flex flex-col gap-2">
            <label htmlFor="nationality" className="text-[#333333] text-sm">
              What is your nationality? (Required)
            </label>
            <Controller
              name="nationality"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                  disabled={isPending}
                >
                  <SelectTrigger className="w-full h-auto border-2 border-[#E0E0E0] text-black text-sm rounded-md py-2 px-3 active:outline-none">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent className="w-full h-[300px] overflow-auto scrollbar-hide">
                    <div className="w-full h-full flex flex-col gap-4 relative pt-8">
                      <input
                        type="search"
                        placeholder="Search country"
                        className="w-[98%] h-auto py-1 px-2 border-2 border-[#E0E0E0] text-black text-sm rounded-md fixed top-1 left-1 bg-white z-10"
                        value={searchNationality}
                        onChange={(e) => setSearchNationality(e.target.value)}
                        autoFocus
                        ref={inputRef}
                      />
                      <SelectGroup>
                        {filteredNationalities?.map((nationality: any) => {
                          if (!nationality.flags || !nationality.name)
                            return null;
                          return (
                            <SelectItem
                              key={nationality.name.common}
                              value={nationality.name.common.toLowerCase()}
                            >
                              <div className="w-full flex items-center gap-2">
                                <Image
                                  src={nationality?.flags?.png}
                                  alt={nationality?.name?.common}
                                  width={20}
                                  height={15}
                                />
                                {nationality?.name?.common}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </div>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.nationality && (
              <p className="text-red-500 text-sm">
                {errors.nationality.message}
              </p>
            )}
          </div>

          <ControlledSelect
            name="ethnicity"
            control={control}
            options={ethnicityOptions}
            placeholder="Select option"
            label="What is your ethnicity?"
            required={true}
            error={errors.ethnicity}
            disabled={isPending}
            // otherFieldName="otherEthnicity"
            register={register}
          />

          <ControlledMultiSelect
            name="languages"
            control={control}
            options={languagesOptions}
            label="What languages do you speak fluently?"
            placeholder="Select languages"
            error={errors.languages}
            disabled={isPending}
            // otherFieldName="otherLanguage"
            register={register}
            required={true}
            contentHeight="300px"
          />

          <ControlledSelect
            name="religion"
            control={control}
            options={religionOptions}
            placeholder="Select option"
            label="What religion, if any, do you identify with?"
            required={false}
            error={errors.religion}
            disabled={isPending}
            // otherFieldName="otherReligion"
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
              {isPending ? "Saving..." : "Save and Continue"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Geo_Culture;
