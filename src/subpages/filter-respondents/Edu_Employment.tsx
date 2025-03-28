"use client";
import React, { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { filterEducationAndEmploymentSchema } from "@/utils/shema";
import {
  educationLevelOptions,
  employmentStatusOptions,
  industryOptions,
  jobRoleOptions,
  savvyOptions,
} from "@/data/respondent-object-data";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import SectionHeader from "@/components/filter-respondents/SectionHeader";
import DropdownSelect from "@/components/filter-respondents/DropdownSelect";

interface Props {
  tab: string;
}

const Edu_Employment: FC<Props> = ({ tab }) => {
  const dispatch = useDispatch();
  const selectedCriteria = useSelector(
    (state: RootState) => state.criteria.selectedCriteria[tab] ?? {}
  );

  const { control, setValue } = useForm<FormData>({
    resolver: zodResolver(filterEducationAndEmploymentSchema),
    defaultValues: {
      education_level: [],
      employment_status: [],
      employment_industry: [],
      job_role: [],
      tech_savvy: [],
    },
  });

  type FormData = z.infer<typeof filterEducationAndEmploymentSchema>;

  useEffect(() => {
    setValue("education_level", selectedCriteria.education_level || []);
    setValue("employment_status", selectedCriteria.employment_status || []);
    setValue("employment_industry", selectedCriteria.employment_industry || []);
    setValue("job_role", selectedCriteria.job_role || []);
    setValue("tech_savvy", selectedCriteria.tech_savvy || []);
  }, [tab, selectedCriteria, setValue]);

  return (
    <div className="w-full h-auto mx-auto">
      <div className="flex flex-col gap-4 w-full lg:w-[90%] mx-auto">
        <SectionHeader title={"Education & Employment"} />
        <form className="flex flex-col gap-5">
          <DropdownSelect
            name="education_level"
            control={control}
            options={educationLevelOptions}
            selectedCriteria={selectedCriteria}
            tab={tab}
            section="education_level"
            dispatch={dispatch}
            title="Specify Education Level"
          />

          <DropdownSelect
            name="employment_status"
            control={control}
            options={employmentStatusOptions}
            selectedCriteria={selectedCriteria}
            tab={tab}
            section="employment_status"
            dispatch={dispatch}
            title="Specify Employment Status"
          />

          <DropdownSelect
            name="employment_industry"
            control={control}
            options={industryOptions}
            selectedCriteria={selectedCriteria}
            tab={tab}
            section="employment_industry"
            dispatch={dispatch}
            title="Specify Employment Industry"
          />

          <DropdownSelect
            name="job_role"
            control={control}
            options={jobRoleOptions}
            selectedCriteria={selectedCriteria}
            tab={tab}
            section="job_role"
            dispatch={dispatch}
            title="Specify Job Role"
          />

          <DropdownSelect
            name="tech_savvy"
            control={control}
            options={savvyOptions}
            selectedCriteria={selectedCriteria}
            tab={tab}
            section="tech_savvy"
            dispatch={dispatch}
            title="Tech Savvy"
          />
        </form>
      </div>
    </div>
  );
};

export default Edu_Employment;
