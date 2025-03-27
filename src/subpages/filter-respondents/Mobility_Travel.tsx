"use client";
import React, { FC, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { filterMobilityAndTravelSchema } from "@/utils/shema";
import {
  commuteOptions,
  travelOptions,
  vehicleOwnershipOptions,
} from "@/data/respondent-object-data";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import SectionHeader from "@/components/filter-respondents/SectionHeader";
import DropdownSelect from "@/components/filter-respondents/DropdownSelect";

interface Props {
  tab: string;
}

const Mobility_Travel: FC<Props> = ({ tab }) => {
  const dispatch = useDispatch();
  const selectedCriteria = useSelector(
    (state: RootState) => state.criteria.selectedCriteria[tab] || {}
  );

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(filterMobilityAndTravelSchema),
    defaultValues: {},
  });

  type FormData = z.infer<typeof filterMobilityAndTravelSchema>;

  useEffect(() => {
    setValue("commute", selectedCriteria.commute || []);
    setValue("travel", selectedCriteria.travel || []);
    setValue("vehicle", selectedCriteria.vehicle || []);
  }, [tab, selectedCriteria, setValue]);

  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="w-full h-auto mx-auto">
      <div className="flex flex-col gap-4 w-full lg:w-[90%] mx-auto">
        <SectionHeader title={"Mobility & Travel"} />
        <form className="flex flex-col gap-5">
          <DropdownSelect
            name="commute"
            control={control}
            options={commuteOptions}
            selectedCriteria={selectedCriteria}
            tab={tab}
            section="commute"
            dispatch={dispatch}
            title="Specify Commute Method"
          />

          <DropdownSelect
            name="travel"
            control={control}
            options={travelOptions}
            selectedCriteria={selectedCriteria}
            tab={tab}
            section="travel"
            dispatch={dispatch}
            title="Specify Travel"
          />

          <DropdownSelect
            name="vehicle"
            control={control}
            options={vehicleOwnershipOptions}
            selectedCriteria={selectedCriteria}
            tab={tab}
            section="vehicle"
            dispatch={dispatch}
            title="Own a Vehicle"
          />
        </form>
      </div>
    </div>
  );
};
export default Mobility_Travel;
