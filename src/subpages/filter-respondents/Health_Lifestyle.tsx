"use client";
import React, { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { filterHealthAndLifestyleSchema } from "@/utils/shema";
import {
  overallHealthOptions,
  helathInsuranceOptions,
  healthConditionOptions,
} from "@/data/respondent-object-data";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import SectionHeader from "@/components/filter-respondents/SectionHeader";
import DropdownSelect from "@/components/filter-respondents/DropdownSelect";

interface Props {
  tab: string;
}

const Health_Lifestyle: FC<Props> = ({ tab }) => {
  const dispatch = useDispatch();
  const selectedCriteria = useSelector(
    (state: RootState) => state.criteria.selectedCriteria[tab] ?? {}
  );

  const { control, setValue } = useForm<FormData>({
    resolver: zodResolver(filterHealthAndLifestyleSchema),
    defaultValues: {},
  });

  type FormData = z.infer<typeof filterHealthAndLifestyleSchema>;

  useEffect(() => {
    setValue("health", selectedCriteria.health || []);
    setValue("health_insurance", selectedCriteria.health_insurance || []);
    setValue("health_condition", selectedCriteria.health_condition || []);
  }, [tab, selectedCriteria, setValue]);

  return (
    <div className="w-full h-auto mx-auto">
      <div className="flex flex-col gap-4 w-full lg:w-[90%] mx-auto">
        <SectionHeader title={"Health & Lifestyle Markers"} />
        <form className="flex flex-col gap-5">
          <DropdownSelect
            name="health"
            control={control}
            options={overallHealthOptions}
            selectedCriteria={selectedCriteria}
            tab={tab}
            section="health"
            dispatch={dispatch}
            title="Specify Overall Health"
          />

          <DropdownSelect
            name="health_insurance"
            control={control}
            options={helathInsuranceOptions}
            selectedCriteria={selectedCriteria}
            tab={tab}
            section="health_insurance"
            dispatch={dispatch}
            title="Specify Insurance Type"
          />

          <DropdownSelect
            name="health_condition"
            control={control}
            options={healthConditionOptions}
            selectedCriteria={selectedCriteria}
            tab={tab}
            section="health_condition"
            dispatch={dispatch}
            title="Specify Health Condition"
          />
        </form>
      </div>
    </div>
  );
};
export default Health_Lifestyle;
