import React, { useState } from "react";
import ResponseHeader from "./ResponseHeader";
import RespondentDetails from "./RespondentDetails";
import UserResponses from "./UserResponses";
import { useParams } from "next/navigation";
import {
  useGetRespondentNameQuery,
  useGetSurveySummaryQuery,
  useGetUserSurveyResponseQuery,
  useValidateIndividualResponseQuery,
  useValidateSurveyResponseQuery,
} from "@/services/survey.service";
import Summary from "./Summary";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const calculateValidationCounts = (data:any) => {
  let validCount = 0;
  let invalidCount = 0;

  data?.forEach((response:any) => {
    response.answers.forEach((answer:any) => {
      if (answer.validation_result?.status === 'passed') {
        validCount += 1;
      } else if (answer.validation_result?.status === 'failed') {
        invalidCount += 1;
      }
    });
  });

  return { validCount, invalidCount };
};

const calculateValidationCounts2 = (survey:any) => {
  let validCount = 0;
  let invalidCount = 0;

  survey?.answers?.forEach((answer:any) => {
    if (answer.validation_result?.status === 'passed') {
      validCount += 1;
    } else if (answer.validation_result?.status === 'failed') {
      invalidCount += 1;
    }
  });

  return { validCount, invalidCount };
};

const Responses: React.FC<{ data: any, }> = ({ data }) => {
  const name = useSelector((state:RootState)=>state?.name?.name)
  const params = useParams();
  const tabs = ["Summary", "Individual Responses", "Deleted"];
  const [activeTab, setActiveTab] = useState("Individual Responses");
  const [currentUserResponse, setCurrentUserResponse] = useState(0);
  const [pagesNumber, setPagesNumber] = useState(1);
  const { data: response_ } = useGetUserSurveyResponseQuery(params.id);
  const { data: summary_ } = useGetSurveySummaryQuery(params.id);

  const path_params = new URLSearchParams();
  path_params.set("name", name);


  const { data:respondent_name } = useGetRespondentNameQuery(params.id);
  const { data:validate_ } = useValidateSurveyResponseQuery(params.id);
  const { data:validate_individual_response } = useValidateIndividualResponseQuery({
    id: params.id, pagesNumber:pagesNumber, path_params:path_params.toString()
  });
  console.log(validate_individual_response)
  const { validCount, invalidCount } = calculateValidationCounts2(validate_individual_response?.data?.data[currentUserResponse]);



 
  const totalResponses = response_?.data?.total || 0;
  console.log(summary_)

 
  // console.log(validate_individual_response?.data?.data);




  const handleNext = () => {
    if (currentUserResponse < totalResponses - 1) {
      setCurrentUserResponse((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentUserResponse > 0) {
      setCurrentUserResponse((prev) => prev - 1);
    }
  };
  return (
    <div className="lg:px-24">
      <ResponseHeader
        data={data}
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        curerentSurvey={currentUserResponse + 1} 
        handleNext={handleNext}
        handlePrev={handlePrev}
        respondent_data={respondent_name?.data}
        valid_response={validCount}
        invalid_response={invalidCount}
      />
      <RespondentDetails data={validate_individual_response?.data?.data[currentUserResponse]} />
      {activeTab === "Individual Responses" && (
        <UserResponses
          data={validate_individual_response?.data?.data[currentUserResponse]}
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
