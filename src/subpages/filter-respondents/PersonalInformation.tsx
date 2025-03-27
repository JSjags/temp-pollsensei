"use client";
import React, { FC, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { filterPersonalInformationSchema } from "@/utils/shema";
import {
  petOptions,
  genderOptions,
  ageGroupOptions,
  dependentsOptions,
} from "@/data/respondent-object-data";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import SectionHeader from "@/components/filter-respondents/SectionHeader";
import DropdownSelect from "@/components/filter-respondents/DropdownSelect";

interface Props {
  tab: string;
}

const PersonalInformation: FC<Props> = ({ tab }) => {
  const dispatch = useDispatch();
  const selectedCriteria = useSelector(
    (state: RootState) => state.criteria.selectedCriteria[tab] ?? {}
  );

  const { control, setValue, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(filterPersonalInformationSchema),
    defaultValues: {
      gender: [],
      ageGroup: [],
      dependents: [],
      pets: [],
    },
  });

  type FormData = z.infer<typeof filterPersonalInformationSchema>;

  useEffect(() => {
    setValue("gender", selectedCriteria.gender || []);
    setValue("ageGroup", selectedCriteria.ageGroup || []);
    setValue("dependents", selectedCriteria.dependents || []);
    setValue("pets", selectedCriteria.pets || []);
  }, [tab, selectedCriteria, setValue]);

  return (
    <div className="w-full h-auto mx-auto">
      <div className="flex flex-col gap-4 w-full lg:w-[90%] mx-auto">
        <SectionHeader title={"Personal Information"} />
        <form className="flex flex-col gap-5">
          <DropdownSelect
            name="gender"
            control={control}
            options={genderOptions}
            selectedCriteria={selectedCriteria}
            tab={tab}
            section="gender"
            dispatch={dispatch}
            title="Specify Gender"
          />

          <DropdownSelect
            name="ageGroup"
            control={control}
            options={ageGroupOptions}
            selectedCriteria={selectedCriteria}
            tab={tab}
            section="ageGroup"
            dispatch={dispatch}
            title="Age Group"
          />

          <DropdownSelect
            name="dependents"
            control={control}
            options={dependentsOptions}
            selectedCriteria={selectedCriteria}
            tab={tab}
            section="dependents"
            dispatch={dispatch}
            title="Have Children or Dependents"
          />

          <DropdownSelect
            name="pets"
            control={control}
            options={petOptions}
            selectedCriteria={selectedCriteria}
            tab={tab}
            section="pets"
            dispatch={dispatch}
            title="Ownership of Pets"
          />
        </form>
      </div>
    </div>
  );
};

export default PersonalInformation;
