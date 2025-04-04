"use client";
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Available from "@/subpages/earn/Available";
import Apply from "@/subpages/earn/Apply";
import Approved from "@/subpages/earn/Approved";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  openSurveyTabs,
  closeSurveyTabs,
} from "@/redux/slices/earnDialogSlice";

const SurveyTabs = () => {
  const tabs = [
    {
      id: 1,
      name: "Available Now",
      value: "available",
      component: <Available />,
    },
    {
      id: 2,
      name: "Apply",
      value: "apply",
      component: <Apply />,
    },
    {
      id: 3,
      name: "Approved",
      value: "approved",
      component: <Approved />,
    },
  ];

  const dispatch = useDispatch();
  const { isSurveyTabsOpen } = useSelector(
    (state: RootState) => state.earnDialogSlice
  );

  return (
    <Dialog
      open={isSurveyTabsOpen}
      onOpenChange={(open) => {
        if (open) {
          dispatch(openSurveyTabs());
        } else {
          dispatch(closeSurveyTabs());
        }
      }}
    >
      <DialogContent className="w-[90%] lg:min-w-[1100px] min-h-auto bg-[#F8F8F8F2] border-0 outline-none p-2 lg:p-10 z-[1000000] flex flex-col justify-center items-center gap-5">
        <Tabs className="w-full h-auto">
          <TabsList className="w-full h-auto bg-white flex justify-start mt-5 lg:mt-0 mb-5 lg:mb-0">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab?.id}
                value={`${tab?.value}`}
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-[#5B03B2] data-[state=active]:bg-transparent  w-1/3 lg:w-fit px-10 text-center data-[state=active]:text-[#333333] font-normal data-[state=active]:font-bold text-[#666666] text-sm lg:text-base"
              >
                <p className="text-xs lg:text-sm text-[#4F5B67]">
                  {" "}
                  {tab.name}{" "}
                </p>
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent
              key={tab?.id}
              value={`${tab?.value}`}
              className="w-full h-[75vh] lg:h-full lg:p-5 overflow-y-auto"
            >
              {tab?.component}
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
export default SurveyTabs;
