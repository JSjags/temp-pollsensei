"use client";
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SelectCriteria from "@/subpages/filter-respondents/SelectCriteria";
import ScreenerSurvey from "@/subpages/filter-respondents/ScreenerSurvey";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import {
  setPurchaseDialog,
  setSurveyDialog,
} from "@/redux/slices/buyRespondentDialogSlice";
import BuyRespondent from "@/components/shop/components/dialogs/BuyRespondent/BuyRespondent";

const FilterRespondents = () => {
  const dispatch = useDispatch();

  // Check session storage for access state
  const allowFilterRespondentsAccess =
    sessionStorage.getItem("allowFilterRespondentsAccess") === "true";

  // Redirect if access is not allowed
  useEffect(() => {
    if (!allowFilterRespondentsAccess) {
      // console.log("Redirecting to /shop");
      redirect("/shop");
    }
  }, [allowFilterRespondentsAccess]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("allowFilterRespondentsAccess");
    };
  }, []);

  if (!allowFilterRespondentsAccess) {
    return null;
  }

  const handleSaveAndContinue = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(setPurchaseDialog(true));
  };

  const handleCloseTab = () => {
    dispatch(setSurveyDialog(false));
    // redirect("/shop");
  };

  return (
    <div className="w-full h-auto relative">
      <Tabs className="w-full h-auto" defaultValue="selectCriteria">
        <TabsList className="w-full bg-white flex items-center justify-center gap-5 py-1">
          <TabsTrigger
            value="selectCriteria"
            className="w-1/2 lg:w-fit data-[state=active]:text-black text-[#666666] text-base data-[state=active]:border-b-2 data-[state=active]:border-[#5B03B2] text-center rounded-none"
          >
            Select Criteria
          </TabsTrigger>
          <TabsTrigger
            value="screenerSurvey"
            className="w-1/2 lg:w-fit data-[state=active]:text-black text-[#666666] text-base data-[state=active]:border-b-2 data-[state=active]:border-[#5B03B2] text-center rounded-none"
          >
            Screener Survey
          </TabsTrigger>
        </TabsList>
        <TabsContent value="selectCriteria">
          <SelectCriteria />
        </TabsContent>
        <TabsContent value="screenerSurvey">
          <ScreenerSurvey />
        </TabsContent>
      </Tabs>

      <BuyRespondent />

      <div className="w-full flex items-center justify-center gap-5 bg-white py-3 px-10 lg:px-0 fixed bottom-0 z-[10000]">
        <Button
          size="default"
          variant="outline"
          className="w-full md:w-[300px] bg-transparent border-[#A9A9B1] rounded-md text-xs md:text-sm p-4 hover:scale-x-105 transition-all text-black"
          onClick={handleCloseTab}
        >
          Cancel
        </Button>
        <Button
          size="default"
          className="w-full md:w-[300px] bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] shadow-[-5px_5px_10px_#563BFF42] hover:bg-purple-700 rounded-md text-xs md:text-sm p-4 hover:scale-x-105 transition-all"
          type="button"
          onClick={handleSaveAndContinue}
        >
          Save and Continue
        </Button>
      </div>
    </div>
  );
};
export default FilterRespondents;
