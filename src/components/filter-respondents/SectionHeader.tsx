"use client";
import React, { FC } from "react";
import SelectedCriteria from "@/components/filter-respondents/SelectedCriteria";

interface Props {
  title: string;
}

const SectionHeader: FC<Props> = ({ title }) => {
  return (
    <div className="flex-col gap-5 hidden lg:flex">
      <h1 className="text-lg font-bold text-left lg:text-center">
        Filter Respondents
      </h1>
      <h2 className="text-sm lg:text-base font-bold text-left">{title}</h2>
    </div>
  );
};
export default SectionHeader;
