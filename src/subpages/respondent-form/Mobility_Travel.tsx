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
import { mobilityAndTravelSchema } from "@/utils/shema";
import {
  commuteOptions,
  travelOptions,
  vehicleOwnershipOptions,
} from "@/data/respondent-object-data";

interface Props {
  onContinue: () => void;
  onPrevious: () => void;
}

const Mobility_Travel: FC<Props> = ({ onContinue, onPrevious }) => {
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
    resolver: zodResolver(mobilityAndTravelSchema),
  });

  type FormData = z.infer<typeof mobilityAndTravelSchema>;

  return (
    <div className="w-full h-full flex flex-col items-center mx-auto">
      <ProgressBar skip={true} progress={87.5} onContinue={onContinue} />
      <div className="flex flex-col gap-4 w-full lg:w-[70%] mx-auto">
        <div className="flex items-center gap-3">
          <IoArrowBack
            className="lg:hidden text-2xl"
            onClick={handlePrevious}
          />
          <h2 className="text-lg lg:text-2xl font-bold">Mobility & Travel</h2>
        </div>
        <form
          className="flex flex-col gap-3"
          onSubmit={handleSubmit(handleContinue)}
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="commute" className="text-[#333333] text-sm">
              How do you usually commute?
            </label>
            <Controller
              name="commute"
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
                        {commuteOptions.map((option) => (
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
                      placeholder="Please specify"
                      className="w-full h-auto px-2 py-1 border-2 border-[#E0E0E0] text-[#898989] text-sm rounded-md mt-2"
                      {...register("otherCommute")}
                      autoFocus
                    />
                  )}
                </>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="travel" className="text-[#333333] text-sm">
              How often do you travel outside your city/town?
            </label>
            <Controller
              name="travel"
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
                      {travelOptions.map((option) => (
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
            <label htmlFor="vehicle" className="text-[#333333] text-sm">
              Do you own a vehicle?
            </label>
            <Controller
              name="vehicle"
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
                      {travelOptions.map((option) => (
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
export default Mobility_Travel;
