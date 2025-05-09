"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const ReviewDialog = () => {
  return (
    <>
      <h2 className="font-bold text-xl">Participant review</h2>
      <div className="w-full h-auto py-4 px-5 shadow-sm shadow-black flex flex-col lg:flex-row gap-5 roundedlg">
        <RadioGroup
          defaultValue="auto"
          className="flex flex-col lg:flex-row gap-5"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="default" id="r1" />
            <Label htmlFor="r1" className="text-[#4F5B67] text-sm">
              Review Participants Automatically
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="manual" id="r2" />
            <Label htmlFor="r1" className="text-[#4F5B67] text-sm">
              Manually review participants
            </Label>
          </div>
        </RadioGroup>
      </div>
      <div className="h-[75vh] lg:h-[70vh] overflow-y-auto w-full shadow-sm shadow-black">
        <h2 className="text-base w-full border-b-2 border-[#E1E1E1] p-2">
          Participant List
        </h2>
      </div>
    </>
  );
};
export default ReviewDialog;
