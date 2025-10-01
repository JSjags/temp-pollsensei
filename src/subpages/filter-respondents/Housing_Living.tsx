"use client";
import React, { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { filterHousingAndLivingSchema } from "@/utils/shema";
import {
  livingConditionOptions,
  livingArrangementOptions,
  householdNumbersOptions,
} from "@/data/respondent-object-data";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import SectionHeader from "@/components/filter-respondents/SectionHeader";
import DropdownSelect from "@/components/filter-respondents/DropdownSelect";

interface Props {
  tab: string;
}

const Housing_Living: FC<Props> = ({ tab }) => {
  const dispatch = useDispatch();
  const selectedCriteria = useSelector(
    (state: RootState) => state.criteria.selectedCriteria[tab] ?? {}
  );

  const { control, setValue } = useForm<FormData>({
    resolver: zodResolver(filterHousingAndLivingSchema),
    defaultValues: {},
  });

  type FormData = z.infer<typeof filterHousingAndLivingSchema>;

  useEffect(() => {
    setValue(
      "living_condition",
      selectedCriteria.living_condition?.values || []
    );
    setValue(
      "living_arrangement",
      selectedCriteria.living_arrangement?.values || []
    );
    setValue("household", selectedCriteria.household?.values || []);
  }, [tab, selectedCriteria, setValue]);

  return (
    <div className="w-full h-auto mx-auto">
      <div className="flex flex-col gap-4 w-full lg:w-[90%] mx-auto">
        <SectionHeader title={"Housing & Living Situation"} />
        <form className="flex flex-col gap-5">
          <DropdownSelect
            name="living_condition"
            control={control}
            options={livingConditionOptions}
            selectedCriteria={selectedCriteria}
            tab={tab}
            section="living_condition"
            dispatch={dispatch}
            title="Specify Living Condition"
          />

          <DropdownSelect
            name="living_arrangement"
            control={control}
            options={livingArrangementOptions}
            selectedCriteria={selectedCriteria}
            tab={tab}
            section="living_arrangement"
            dispatch={dispatch}
            title="Specify Living Arrangement"
          />

          <DropdownSelect
            name="household"
            control={control}
            options={householdNumbersOptions}
            selectedCriteria={selectedCriteria}
            tab={tab}
            section="household"
            dispatch={dispatch}
            title="Household members"
          />
        </form>
      </div>
    </div>
  );
};
export default Housing_Living;
