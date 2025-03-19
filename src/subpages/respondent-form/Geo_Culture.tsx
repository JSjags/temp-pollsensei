"use client";
import React, { FC, useState, useEffect, useRef } from "react";
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
import { IoArrowBack } from "react-icons/io5";
import ProgressBar from "@/components/respondent-form/ProgressBar";
import { Checkbox } from "@/components/ui/shadcn-checkbox";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { geographyAndCultureSchema } from "@/utils/shema";
import { IoClose } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import { getNationality } from "@/services/api/apiGetRequest";
import Image from "next/image";
import {
  languagesOptions,
  locationOptions,
  regionOptions,
  ethnicityOptions,
  religionOptions,
} from "@/data/respondent-object-data";

interface Props {
  onContinue: () => void;
  onPrevious: () => void;
}

const Geo_Culture: FC<Props> = ({ onContinue, onPrevious }) => {
  const [searchNationality, setSearchNationality] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(geographyAndCultureSchema),
    defaultValues: {
      languages: [],
    },
  });

  type FormData = z.infer<typeof geographyAndCultureSchema>;

  // function to handle the next tab/section
  const handleContinue = (data: FormData) => {
    onContinue();
  };

  // function to handle the previous tab/section
  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    onPrevious();
  };

  // const handleLanguageChange = (
  //   field: any,
  //   language: string,
  //   checked: boolean
  // ) => {
  //   const updatedLanguages = checked
  //     ? [...field.value, language]
  //     : field.value.filter((l: string) => l !== language);
  //   field.onChange(updatedLanguages);
  // };

  // function to remove selected language
  const removeLanguage = (field: any, language: string) => {
    const updatedLanguages = field.value.filter((l: string) => l !== language);
    field.onChange(updatedLanguages);
  };

  const { data: nationalities } = useQuery({
    queryKey: [],
    queryFn: async () => getNationality(),
    enabled: true,
    // staleTime: Infinity,
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
          <div className="flex flex-col gap-2">
            <label htmlFor="location" className="text-[#333333] text-sm">
              Where do you currently live? (Required)
            </label>
            <Controller
              name="location"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-full h-auto border-2 border-[#E0E0E0] text-[#898989] text-sm rounded-md py-2 px-3 active:outline-none">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent className="w-full h-auto">
                      <SelectGroup>
                        {locationOptions.map((option) => (
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
                      {...register("otherLocation")}
                      autoFocus
                    />
                  )}
                </>
              )}
            />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="region" className="text-[#333333] text-sm">
              Which region do you live in? (Required)
            </label>
            <Controller
              name="region"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-full h-auto border-2 border-[#E0E0E0] text-[#898989] text-sm rounded-md py-2 px-3 active:outline-none">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent className="w-full h-auto">
                      <SelectGroup>
                        {regionOptions.map((option) => (
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
                      {...register("otherRegion")}
                      autoFocus
                    />
                  )}
                </>
              )}
            />
            {errors.region && (
              <p className="text-red-500 text-sm">{errors.region.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="nationality" className="text-[#333333] text-sm">
              What is your nationality? (Required)
            </label>
            <Controller
              name="nationality"
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
                  <SelectContent className="w-full h-[300px] overflow-auto scrollbar-hide">
                    <div className="w-full h-full flex flex-col gap-4 relative pt-8">
                      <input
                        type="search"
                        placeholder="Search country"
                        className="w-[98%] h-auto py-1 px-2 border-2 border-[#E0E0E0] text-[#898989] text-sm rounded-md fixed top-1 left-1 bg-white z-10"
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
                                  alt={nationality?.name.common}
                                  width={20}
                                  height={15}
                                  // layout="fill"
                                  // objectFit="cover"
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
          <div className="flex flex-col gap-2">
            <label htmlFor="ethnicity" className="text-[#333333] text-sm">
              What is your ethnicity? (Required)
            </label>
            <Controller
              name="ethnicity"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-full h-auto border-2 border-[#E0E0E0] text-[#898989] text-sm rounded-md py-2 px-3 active:outline-none">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent className="w-full h-auto">
                      <SelectGroup>
                        {ethnicityOptions.map((option) => (
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
                      {...register("otherEthnicity")}
                      autoFocus
                    />
                  )}
                </>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="language" className="text-[#333333] text-sm">
              What languages do you speak fluently? (Required)
            </label>
            <Controller
              name="languages"
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
                    <DropdownMenuContent className="w-[450px] h-[300px] flex flex-col overflow-auto scrollbar-hide">
                      {languagesOptions.map((language) => (
                        <div
                          key={language}
                          className="flex items-center gap-2 w-full hover:bg-[#CB85FD1A] px-5 rounded-sm"
                        >
                          <Checkbox
                            id={language}
                            checked={field.value.includes(language)}
                            onCheckedChange={(checked) => {
                              const updatedLanguages = checked
                                ? [...field.value, language]
                                : field.value.filter((l) => l !== language);
                              field.onChange(updatedLanguages);
                            }}
                          />
                          <DropdownMenuLabel className="text-base capitalize font-normal">
                            {language}
                          </DropdownMenuLabel>
                        </div>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="flex flex-wrap gap-2">
                    {field.value.map((language) => (
                      <div
                        key={language}
                        className={`flex items-center gap-1 bg-[#E8DEF8] rounded-xl py-1 px-2 ${
                          language.includes("other") ? "hidden" : "inline-block"
                        }`}
                      >
                        <span className="text-sm capitalize">{language}</span>
                        <IoClose
                          className="text-lg cursor-pointer"
                          onClick={() => removeLanguage(field, language)}
                        />
                      </div>
                    ))}
                  </div>

                  {field.value.includes("other") && (
                    <input
                      type="text"
                      placeholder="Other (Please specify)"
                      className="w-full h-auto px-2 py-1 border-2 border-[#E0E0E0] text-[#898989] text-sm rounded-md mt-2"
                      {...register("otherLanguage")}
                      autoFocus
                    />
                  )}
                </>
              )}
            />
            {errors.languages && (
              <p className="text-red-500 text-sm">{errors.languages.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="religion" className="text-[#333333] text-sm">
              What religion, if any, do you identify with? (Optional)
            </label>
            <Controller
              name="religion"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-full h-auto border-2 border-[#E0E0E0] text-[#898989] text-sm rounded-md py-2 px-3 active:outline-none">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent className="w-full h-auto">
                      <SelectGroup>
                        {religionOptions.map((option) => (
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
                      {...register("otherReligion")}
                      autoFocus
                    />
                  )}
                </>
              )}
            />
            {errors.religion && (
              <p className="text-red-500 text-sm">{errors.religion.message}</p>
            )}
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
              Save and Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Geo_Culture;
