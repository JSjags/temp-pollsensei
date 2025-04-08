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

  // Count the number of sections with at least one selected criterion
  const totalCriteria = Object.values(selectedCriteria).reduce((acc, tab) => {
    return (
      acc + Object.values(tab).filter((section) => section.length > 0).length
    );
  }, 0);

  useEffect(() => {
    // Clear criteria when the component mounts
    dispatch(clearCriteria());
  }, [dispatch]);

  //   console.log("Selected Criteria:", selectedCriteria);

  return (
    <div className="flex items-center justify-start lg:justify-end gap-1 w-[300px]">
      <h5 className="text-sm lg:text-lg font-normal"> Selected Criteria: </h5>
      <h5 className="text-sm lg:text-lg font-bold"> {totalCriteria} </h5>
    </div>
  );
};
export default SelectedCriteria;
