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
import { IoArrowBack } from "react-icons/io5";
import ProgressBar from "@/components/respondent-form/ProgressBar";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { techAndMediaSchema } from "@/utils/shema";
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

interface Props {
  onContinue: () => void;
  onPrevious: () => void;
}

const Tech_Media: FC<Props> = ({ onContinue, onPrevious }) => {
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
    resolver: zodResolver(techAndMediaSchema),
  });

  type FormData = z.infer<typeof techAndMediaSchema>;

  // function to handle content selection
  const handleContentChange = (
    field: any,
    content: string,
    checked: boolean
  ) => {
    const updatedContents = checked
      ? [...field.value, content]
      : field.value.filter((c: string) => c !== content);
    field.onChange(updatedContents);
  };

  // function to remove selected content(s)
  const removeContent = (field: any, content: string) => {
    const updatedContents = field.value.filter((c: string) => c !== content);
    field.onChange(updatedContents);
  };

  // function to handle platform selection
  const handlePlatformChange = (
    field: any,
    platform: string,
    checked: boolean
  ) => {
    const updatedPlatforms = checked
      ? [...field.value, platform]
      : field.value.filter((p: string) => p !== platform);
    field.onChange(updatedPlatforms);
  };

  // function to remove selected platform(s)
  const removePlatform = (field: any, platform: string) => {
    const updatedPlatforms = field.value.filter((p: string) => p !== platform);
    field.onChange(updatedPlatforms);
  };

  // function to handle browser selection
  const handleBrowserChange = (
    field: any,
    browser: string,
    checked: boolean
  ) => {
    const updatedBrowser = checked
      ? [...field.value, browser]
      : field.value.filter((b: string) => b !== browser);
    field.onChange(updatedBrowser);
  };

  // function to remove selected browser(s)
  const removeBrowser = (field: any, browser: string) => {
    const updatedBrowser = field.value.filter((b: string) => b !== browser);
    field.onChange(updatedBrowser);
  };

  return (
    <div className="w-full h-full flex flex-col items-center mx-auto">
      <ProgressBar skip={true} progress={62.5} onContinue={onContinue} />
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
          <div className="flex flex-col gap-2">
            <label htmlFor="internet" className="text-[#333333] text-sm">
              Do you use the internet regularly?
            </label>
            <Controller
              name="internet"
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
                      {internetUsageOptions.map((option) => (
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
            <label htmlFor="access" className="text-[#333333] text-sm">
              How do you primarily access the internet?
            </label>
            <Controller
              name="primary_access"
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
                        {internetAccessOptions.map((option) => (
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
                      {...register("otherPrimaryAccess")}
                      autoFocus
                    />
                  )}
                </>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="social" className="text-[#333333] text-sm">
              How often do you use social media?
            </label>
            <Controller
              name="social_media"
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
                      {socialMediaUsageOptions.map((option) => (
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
            <label htmlFor="content" className="text-[#333333] text-sm">
              What type of content do you engage with the most? (Select all that
              apply)
            </label>
            <Controller
              name="content"
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
                    <DropdownMenuContent className="w-[450px] h-auto flex flex-col">
                      {contentOptions.map((content) => (
                        <div
                          key={content}
                          className="flex items-center gap-2 w-full hover:bg-[#CB85FD1A] px-5 rounded-sm"
                        >
                          <Checkbox
                            id={content}
                            checked={field.value!.includes(content)}
                            onCheckedChange={(checked) =>
                              handleContentChange(field, content, !!checked)
                            }
                          />
                          <DropdownMenuLabel className="text-base capitalize font-normal">
                            {content}
                          </DropdownMenuLabel>
                        </div>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="flex flex-wrap gap-2">
                    {field.value!.map((content: string) => (
                      <div
                        key={content}
                        className="flex items-center gap-1 bg-[#E8DEF8] rounded-xl py-1 px-2"
                      >
                        <span className="text-sm capitalize">{content}</span>
                        <IoClose
                          className="text-lg cursor-pointer"
                          onClick={() => removeContent(field, content)}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            />
          </div>
          <h2 className="text-[#8A8A8A] text-xl fond-bold my-3">
            Addition Information
          </h2>
          <div className="flex flex-col gap-2">
            <label htmlFor="media" className="text-[#333333] text-sm">
              What social media platform(s) do you use?
            </label>
            <Controller
              name="platform"
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
                    <DropdownMenuContent className="w-[450px] h-[300px] overflow-auto flex flex-col">
                      {platformOptions.map((platform) => (
                        <div
                          key={platform}
                          className="flex items-center gap-2 w-full hover:bg-[#CB85FD1A] px-5 rounded-sm"
                        >
                          <Checkbox
                            id={platform}
                            checked={field.value!.includes(platform)}
                            onCheckedChange={(checked) =>
                              handlePlatformChange(field, platform, !!checked)
                            }
                          />
                          <DropdownMenuLabel className="text-base capitalize font-normal">
                            {platform}
                          </DropdownMenuLabel>
                        </div>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="flex flex-wrap gap-2">
                    {field.value!.map((platform: string) => (
                      <div
                        key={platform}
                        className="flex items-center gap-1 bg-[#E8DEF8] rounded-xl py-1 px-2"
                      >
                        <span className="text-sm capitalize">{platform}</span>
                        <IoClose
                          className="text-lg cursor-pointer"
                          onClick={() => removePlatform(field, platform)}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="browser" className="text-[#333333] text-sm">
              Which internet browser(s) do you use?
            </label>
            <Controller
              name="browser"
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
                    <DropdownMenuContent className="w-[450px] h-auto flex flex-col">
                      {browserOptions.map((browser) => (
                        <div
                          key={browser}
                          className="flex items-center gap-2 w-full hover:bg-[#CB85FD1A] px-5 rounded-sm"
                        >
                          <Checkbox
                            id={browser}
                            checked={field.value!.includes(browser)}
                            onCheckedChange={(checked) =>
                              handleBrowserChange(field, browser, !!checked)
                            }
                          />
                          <DropdownMenuLabel className="text-base capitalize font-normal">
                            {browser}
                          </DropdownMenuLabel>
                        </div>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="flex flex-wrap gap-2">
                    {field.value!.map((browser: string) => (
                      <div
                        key={browser}
                        className="flex items-center gap-1 bg-[#E8DEF8] rounded-xl py-1 px-2"
                      >
                        <span className="text-sm capitalize">{browser}</span>
                        <IoClose
                          className="text-lg cursor-pointer"
                          onClick={() => removeBrowser(field, browser)}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="computer" className="text-[#333333] text-sm">
              What computer operating system(s) do you use?
            </label>
            <Controller
              name="pc_operating_system"
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
                        {PcOperatingSystemOptions.map((option) => (
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
                      {...register("otherPcOperatingSystem")}
                      autoFocus
                    />
                  )}
                </>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="smartphone" className="text-[#333333] text-sm">
              What Smartphone operating system(s) do you use?
            </label>
            <Controller
              name="mobile_operating_system"
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
                        {operatingSystemOptions.map((option) => (
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
                      {...register("otherPcOperatingSystem")}
                      autoFocus
                    />
                  )}
                </>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="tablet" className="text-[#333333] text-sm">
              What tablet operating system(s) do you use?
            </label>
            <Controller
              name="tablet_operating_system"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-full h-auto border-2 border-[#E0E0E0] text-[#898989] text-sm rounded-md py-2 px-3 active:outline-none">
                      <SelectValue placeholder="Select option(s)" />
                    </SelectTrigger>
                    <SelectContent className="w-full h-auto">
                      <SelectGroup>
                        {operatingSystemOptions.map((option) => (
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
                      {...register("otherPcOperatingSystem")}
                      autoFocus
                    />
                  )}
                </>
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
export default Tech_Media;
