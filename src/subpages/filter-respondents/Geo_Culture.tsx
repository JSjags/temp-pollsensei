"use client";
import React, { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { filterGeographyAndCultureSchema } from "@/utils/shema";
import {
  locationOptions,
  regionOptions,
  ethnicityOptions,
} from "@/data/respondent-object-data";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import SectionHeader from "@/components/filter-respondents/SectionHeader";
import DropdownSelect from "@/components/filter-respondents/DropdownSelect";

interface Props {
  tab: string;
}

const Geo_Culture: FC<Props> = ({ tab }) => {
  const dispatch = useDispatch();
  const selectedCriteria = useSelector(
    (state: RootState) => state.criteria.selectedCriteria[tab] ?? {}
  );

  const { control, setValue } = useForm<FormData>({
    resolver: zodResolver(filterGeographyAndCultureSchema),
    defaultValues: {
      location: [],
      region: [],
      ethnicity: [],
    },
  });

  type FormData = z.infer<typeof filterGeographyAndCultureSchema>;

  useEffect(() => {
    setValue("location", selectedCriteria.location || []);
    setValue("region", selectedCriteria.region || []);
    setValue("ethnicity", selectedCriteria.ethnicity || []);
  }, [tab, selectedCriteria, setValue]);

  return (
    <div className="w-full h-auto mx-auto">
      <div className="flex flex-col gap-4 w-full lg:w-[90%] mx-auto">
        <SectionHeader title={"Geographic & Cultural Information"} />
        <form className="flex flex-col gap-5">
          <DropdownSelect
            name="location"
            control={control}
            options={locationOptions}
            selectedCriteria={selectedCriteria}
            tab={tab}
            section="location"
            dispatch={dispatch}
            title="Specify Location"
          />

          <DropdownSelect
            name="region"
            control={control}
            options={regionOptions}
            selectedCriteria={selectedCriteria}
            tab={tab}
            section="region"
            dispatch={dispatch}
            title="Specify Region"
          />

          <DropdownSelect
            name="ethnicity"
            control={control}
            options={ethnicityOptions}
            selectedCriteria={selectedCriteria}
            tab={tab}
            section="ethnicity"
            dispatch={dispatch}
            title="Specify Ethnicity"
          />
        </form>
      </div>
    </div>
  );
};

export default Geo_Culture;
