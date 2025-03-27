"use client";
import React, { FC, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { filterTechAndMediaSchema } from "@/utils/shema";
import {
  contentOptions,
  platformOptions,
  browserOptions,
  internetUsageOptions,
  internetAccessOptions,
  socialMediaUsageOptions,
} from "@/data/respondent-object-data";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import SectionHeader from "@/components/filter-respondents/SectionHeader";
import DropdownSelect from "@/components/filter-respondents/DropdownSelect";

interface Props {
  tab: string;
}

const Tech_Media: FC<Props> = ({ tab }) => {
  const dispatch = useDispatch();
  const selectedCriteria = useSelector(
    (state: RootState) => state.criteria.selectedCriteria[tab] ?? {}
  );

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(filterTechAndMediaSchema),
    defaultValues: {},
  });

  type FormData = z.infer<typeof filterTechAndMediaSchema>;

  useEffect(() => {
    setValue("internet", selectedCriteria.internet || []);
    setValue("primary_access", selectedCriteria.primary_access || []);
    setValue("social_media", selectedCriteria.social_media || []);
    setValue("content", selectedCriteria.content || []);
    setValue("platform", selectedCriteria.platform || []);
    setValue("browser", selectedCriteria.browser || []);
  }, [tab, selectedCriteria, setValue]);

  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="w-full h-auto mx-auto">
      <div className="flex flex-col gap-4 w-full lg:w-[90%] mx-auto">
        <SectionHeader title={"Technology & Media Usage"} />
        <form className="flex flex-col gap-5">
          <DropdownSelect
            name="internet"
            control={control}
            options={internetUsageOptions}
            selectedCriteria={selectedCriteria}
            tab={tab}
            section="internet"
            dispatch={dispatch}
            title="Regular Internet User"
          />

          <DropdownSelect
            name="primary_access"
            control={control}
            options={internetAccessOptions}
            selectedCriteria={selectedCriteria}
            tab={tab}
            section="primary_access"
            dispatch={dispatch}
            title="Internet Primary Access"
          />

          <DropdownSelect
            name="social_media"
            control={control}
            options={socialMediaUsageOptions}
            selectedCriteria={selectedCriteria}
            tab={tab}
            section="social_media"
            dispatch={dispatch}
            title="Specify Social Media Usage"
          />

          <DropdownSelect
            name="content"
            control={control}
            options={contentOptions}
            selectedCriteria={selectedCriteria}
            tab={tab}
            section="content"
            dispatch={dispatch}
            title="Specify Content"
          />

          <DropdownSelect
            name="platform"
            control={control}
            options={platformOptions}
            selectedCriteria={selectedCriteria}
            tab={tab}
            section="platform"
            dispatch={dispatch}
            title="Specify Platform"
          />

          <DropdownSelect
            name="browser"
            control={control}
            options={browserOptions}
            selectedCriteria={selectedCriteria}
            tab={tab}
            section="browser"
            dispatch={dispatch}
            title="Specify Browser"
          />
        </form>
      </div>
    </div>
  );
};
export default Tech_Media;
