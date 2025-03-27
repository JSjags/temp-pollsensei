"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralTab from "@/subpages/filter-respondents/GeneralTab";
import MostPopular from "@/subpages/filter-respondents/MostPopular";
import RecentlyUsed from "@/subpages/filter-respondents/RecentlyUsed";
import SelectedCriteria from "@/components/filter-respondents/SelectedCriteria";

const SelectCriteria = () => {
  return (
    <div className="w-full h-auto relative">
      <Tabs className="w-full h-auto" defaultValue="general">
        <TabsList className="w-full h-auto flex flex-col lg:flex-row gap-2 lg:gap-0 items-center justify-between py-1">
          <div className="w-full flex items-center justify-start gap-3">
            <TabsTrigger
              value="general"
              className="w-fit text-[#333333] text-sm lg:text-base border-2 border-transparent data-[state=active]:border-[#5B03B2] bg-[#F1EFF4] data-[state=active]:bg-[#E6D7F466] text-center rounded-full p-2 py-1"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              value="mostPopular"
              className="w-fit text-[#333333] text-sm lg:text-base border-2 border-transparent data-[state=active]:border-[#5B03B2] bg-[#F1EFF4] data-[state=active]:bg-[#E6D7F466] text-center rounded-full p-2 py-1"
            >
              Most Popular
            </TabsTrigger>
            <TabsTrigger
              value="recentlyUsed"
              className="w-fit text-[#333333] text-sm lg:text-base border-2 border-transparent data-[state=active]:border-[#5B03B2] bg-[#F1EFF4] data-[state=active]:bg-[#E6D7F466] text-center rounded-full p-2 py-1"
            >
              Recently Used
            </TabsTrigger>
          </div>
          <SelectedCriteria />
        </TabsList>

        <TabsContent value="general">
          <GeneralTab />
        </TabsContent>
        <TabsContent value="mostPopular">
          <MostPopular />
        </TabsContent>
        <TabsContent value="recentlyUsed">
          <RecentlyUsed />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default SelectCriteria;
