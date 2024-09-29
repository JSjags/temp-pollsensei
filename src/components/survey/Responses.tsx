import React, { useState } from "react";
import ResponseHeader from "./ResponseHeader";
import RespondentDetails from "./RespondentDetails";
import UserResponses from "./UserResponses";
import { useParams } from "next/navigation";
import {
  useGetSurveySummaryQuery,
  useGetUserSurveyResponseQuery,
} from "@/services/survey.service";
import Summary from "./Summary";

const Responses: React.FC<{ data: any }> = ({ data }) => {
  const params = useParams();
  const tabs = ["Summary", "Individual Responses", "Deleted"];
  const [activeTab, setActiveTab] = useState("Individual Responses");
  const [currentUserResponse, setCurrentUserResponse] = useState(0);
  const { data: response_ } = useGetUserSurveyResponseQuery(params.id);
  const { data: summary_ } = useGetSurveySummaryQuery(params.id);
  console.log(summary_?.data);
  console.log(response_?.data?.data[currentUserResponse]);
  return (
    <div className="lg:px-24">
      <ResponseHeader
        data={data}
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        curerentSurvey={currentUserResponse + 1}
      />
      <RespondentDetails data={response_?.data?.data[currentUserResponse]} />
      {activeTab === "Individual Responses" && (
        <UserResponses
          data={response_?.data?.data[currentUserResponse]}
          index={currentUserResponse}
        />
      )}
      {activeTab === "Summary" && (
        <div className="mt-2 min-h-[50vh]">
          <Summary />
        </div>
      )}
      {activeTab === "Deleted" && (
        <div className="mt-2 min-h-[50vh]">Delete component goes here</div>
      )}
    </div>
  );
};

export default Responses;
