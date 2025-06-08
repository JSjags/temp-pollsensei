"use client";
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Available from "@/subpages/earn/Available";
import Apply from "@/subpages/earn/Apply";
import Applications from "@/subpages/earn/Applications";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  openSurveyTabs,
  closeSurveyTabs,
} from "@/redux/slices/earnDialogSlice";
import {
  fetchAvailableSurveys,
  fetchApplySurveys,
  fetchApplicationSurveys,
} from "@/services/api/apiRequest";
import { useInfiniteQuery } from "@tanstack/react-query";
import { APP_KEYS } from "@/constants";

const SurveyTabs = () => {
  const dispatch = useDispatch();
  const { isSurveyTabsOpen } = useSelector(
    (state: RootState) => state.earnDialogSlice
  );

  const [activeTab, setActiveTab] = useState<string>("available");

  const {
    data: availableSurveys,
    isLoading: loadingAvailable,
    fetchNextPage: fetchNextAvailable,
    hasNextPage: hasNextAvailable,
    isFetchingNextPage: isFetchingNextAvailable,
  } = useInfiniteQuery({
    queryKey: [APP_KEYS.AVAILABLE_SURVEYS],
    queryFn: ({ pageParam = 1 }) => fetchAvailableSurveys(pageParam, 8),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.data || lastPage.data.length < 8) {
        return undefined;
      }
      return allPages.length + 1;
    },
    initialPageParam: 1,
    enabled: activeTab === "available",
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });

  const {
    data: applySurveys,
    isLoading: loadingApply,
    fetchNextPage: fetchNextApply,
    hasNextPage: hasNextApply,
    isFetchingNextPage: isFetchingNextApply,
  } = useInfiniteQuery({
    queryKey: [APP_KEYS.APPLY_SURVEYS],
    queryFn: ({ pageParam = 1 }) => fetchApplySurveys(pageParam, 8),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.data || lastPage.data.length < 8) {
        return undefined;
      }
      return allPages.length + 1;
    },
    initialPageParam: 1,
    enabled: activeTab === "apply",
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });

  const {
    data: applicationSurveys,
    isLoading: loadingApplication,
    fetchNextPage: fetchNextApplication,
    hasNextPage: hasNextApplication,
    isFetchingNextPage: isFetchingNextApplication,
  } = useInfiniteQuery({
    queryKey: [APP_KEYS.APPLICATION_SURVEYS],
    queryFn: ({ pageParam = 1 }) => fetchApplicationSurveys(pageParam, 8),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.data || lastPage.data.length < 8) {
        return undefined;
      }
      return allPages.length + 1;
    },
    initialPageParam: 1,
    enabled: activeTab === "applications",
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });

  const tabs = [
    {
      id: 1,
      name: "Available Now",
      value: "available",
      component: (
        <Available
          availableSurveys={availableSurveys}
          isLoading={loadingAvailable}
          activeTab={activeTab}
          fetchNextPage={fetchNextAvailable}
          hasNextPage={hasNextAvailable}
          isFetchingNextPage={isFetchingNextAvailable}
        />
      ),
    },
    {
      id: 2,
      name: "Apply",
      value: "apply",
      component: (
        <Apply
          applySurveys={applySurveys}
          applicationSurveys={applicationSurveys}
          isLoading={loadingApply}
          activeTab={activeTab}
          fetchNextPage={fetchNextApply}
          hasNextPage={hasNextApply}
          isFetchingNextPage={isFetchingNextApply}
        />
      ),
    },
    {
      id: 3,
      name: "Applications",
      value: "applications",
      component: (
        <Applications
          applicationSurveys={applicationSurveys}
          isLoading={loadingApplication}
          activeTab={activeTab}
          fetchNextPage={fetchNextApplication}
          hasNextPage={hasNextApplication}
          isFetchingNextPage={isFetchingNextApplication}
        />
      ),
    },
  ];

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
        <Tabs
          className="w-full h-auto"
          value={activeTab}
          onValueChange={setActiveTab}
        >
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
              className="w-full max-h-[75vh] overflow-y-auto lg:p-5"
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
