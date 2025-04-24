"use client";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { clearCriteria } from "@/redux/slices/criteriaSlice";

const SelectedCriteria = () => {
  const dispatch = useDispatch();
  const selectedCriteria = useSelector(
    (state: RootState) => state.criteria.selectedCriteria
  );

  const totalCriteria = Object.values(selectedCriteria).reduce((acc, tab) => {
    return (
      acc +
      Object.values(tab).filter(
        (section: { required: boolean; values: string[] }) =>
          section.values.length > 0
      ).length
    );
  }, 0);

  useEffect(() => {
    dispatch(clearCriteria());
  }, [dispatch]);

  return (
    <div className="flex items-center justify-start lg:justify-end gap-1 w-[300px]">
      <h5 className="text-sm lg:text-lg font-normal"> Selected Criteria: </h5>
      <h5 className="text-sm lg:text-lg font-bold"> {totalCriteria} </h5>
    </div>
  );
};

export default SelectedCriteria;
