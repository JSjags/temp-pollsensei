"use client";

import React, { useCallback, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "../ui/sheet";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface Tab {
  label: string;
  value: string;
}

const slugify = (tab: string) => {
  return tab.toLowerCase().replace(/\s+/g, "-");
};

const TutorialNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");

  const tabs: Tab[] = [
    { label: "All Resources", value: "all" },
    { label: "Video Tutorials", value: "video-tutorial" },
    { label: "Web articles", value: "web-articles" },
  ];

  const pathname = usePathname();
  const getActiveTabFromPath = useCallback(
    (path: string) => {
      const matchedTab = tabs?.find((tab) => path.includes(slugify(tab.value)));
      return matchedTab || "tutorials";
    },
    [tabs]
  );

  const RoutePath = (tab: string) => {
    if (pathname.includes("tutorials")) {
      return tab === "tutorials" ? `/tutorials` : `/tutorials/${slugify(tab)}`;
    }
    return "/";
  };

  return (
    <div className="flex items-center justify-between w-full  p-4">
      {/* Tabs */}
      <div className="flex space-x-8">
        {tabs.map((tab) => (
          <Link
          href={RoutePath(tab.value)}
            key={tab.value}
            className={`text-sm font-medium pb-2 ${
              activeTab === tab.value
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <Sheet>
        <SheetTrigger>
          <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg focus:outline-none">
            Add New Tutorial
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full md:w-1/3 bg-white">
          <SheetHeader>
            <SheetTitle>Create New Tutorial</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question
              </label>
              <input
                type="text"
                placeholder="Enter Title"
                className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Answer
              </label>
              <textarea
                placeholder="Type brief description"
                rows={4}
                className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-end space-x-4 w-full">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
                Cancel
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-400 rounded-md hover:shadow-lg">
                Save and Continue
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TutorialNavigation;
