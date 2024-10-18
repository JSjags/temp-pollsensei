import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  useGetSurveySummaryQuery,
  useGetUserSurveyResponseQuery,
  useValidateIndividualResponseQuery,
} from "@/services/survey.service";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Collaborators from "@/components/survey/Collaborators";
import GeneralSettings from "@/components/survey/GeneralSettings";

const SurveySettings: React.FC<{ data?: any }> = ({ data }) => {
  const name = useSelector((state: RootState) => state?.name?.name);
  const params = useParams();
  const tabs = ["General Settings", "Collaborators",];
  const [activeTab, setActiveTab] = useState("General Settings");
  const [pagesNumber, setPagesNumber] = useState(1);
  const { data: response_ } = useGetUserSurveyResponseQuery(params.id);
  const { data: summary_ } = useGetSurveySummaryQuery(params.id);

  const path_params = new URLSearchParams();
  path_params.set("name", name);

  const { data: validate_individual_response } =
    useValidateIndividualResponseQuery({
      id: params.id,
      pagesNumber: pagesNumber,
      path_params: path_params.toString(),
    });
  console.log(validate_individual_response);

  const totalResponses = response_?.data?.total || 0;
  console.log(summary_);

  return (
    <div className="lg:px-24 mt-10">
      <div className="flex justify-center  border-gray-300 overflow-x-auto">
        {tabs.map((tab: any) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 transition-colors duration-200 ${
              activeTab === tab
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "General Settings" && <GeneralSettings />}
      {activeTab === "Collaborators" && (
        <div className="mt-2 min-h-[50vh]">
          <Collaborators />
        </div>
      )}
    </div>
  );
};

export default SurveySettings;
