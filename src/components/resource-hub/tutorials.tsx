import { useTutorialQuery } from "@/services/superadmin.service";
import React, { useState } from "react";
import { ConditionalRender } from "../common/AppTabs";
import TextTutorial from "./TextTutorial";
import VideoTutorial from "./VideoTutorial";

const Tutorials: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Text Articles");
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error, refetch } = useTutorialQuery({
    pagesNumber: currentPage,
    filter_by: "web",
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-4">
        Tutorials for you
      </h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab("Text Articles")}
          className={`px-4 py-2 rounded-full font-semibold ${
            activeTab === "Text Articles"
              ? "bg-purple-600 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          Text Articles
        </button>
        <button
          onClick={() => setActiveTab("Videos")}
          className={`px-4 py-2 rounded-full font-semibold ${
            activeTab === "Videos"
              ? "bg-purple-600 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          Videos
        </button>
      </div>

      <ConditionalRender condition={activeTab === "Text Articles"}>
        <TextTutorial />
      </ConditionalRender>
      <ConditionalRender condition={activeTab !== "Text Articles"}>
        <VideoTutorial />
      </ConditionalRender>
    </div>
  );
};

export default Tutorials;
