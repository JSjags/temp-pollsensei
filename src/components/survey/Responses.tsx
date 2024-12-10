import React, { useEffect, useState, Suspense } from "react";
import ResponseHeader from "./ResponseHeader";
import RespondentDetails from "./RespondentDetails";
import UserResponses from "./UserResponses";
import { useParams, useSearchParams, useRouter } from "next/navigation";
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
import { toast } from "react-toastify";
import { resetAnswers } from "@/redux/slices/answer.slice";
import { useDispatch } from "react-redux";
import { resetName } from "@/redux/slices/name.slice";
import FeatureComing from "../common/FeatureComing";
import { resetFilters } from "@/redux/slices/filter.slice";


interface PathParamsProps{
  name?:string;
  question?:string;
  question_type?:string;
  answer?:string;

}

const calculateValidationCounts = (data: any) => {
  let validCount = 0;
  let invalidCount = 0;

  data?.forEach((response: any) => {
    response.answers.forEach((answer: any) => {
      if (answer.validation_result?.status === "passed") {
        validCount += 1;
      } else if (answer.validation_result?.status === "failed") {
        invalidCount += 1;
      }
    });
  });

  return { validCount, invalidCount };
};

const calculateValidationCounts2 = (survey: any) => {
  let validCount = 0;
  let invalidCount = 0;

  survey?.answers?.forEach((answer: any) => {
    if (answer.validation_result?.status === "passed") {
      validCount += 1;
    } else if (answer.validation_result?.status === "failed") {
      invalidCount += 1;
    }
  });

  return { validCount, invalidCount };
};

const Responses: React.FC<{ data: any }> = ({ data }) => {
  const name = useSelector((state: RootState) => state?.name?.name);
  const question = useSelector((state: RootState) => state?.filter.question);
  const questionType = useSelector((state: RootState) => state?.filter.questionType);
  const answer = useSelector((state: RootState) => state?.filter.answer);
  const params = useParams();
  const userRoles = useSelector(
    (state: RootState) => state.user.user?.roles[0].role || []
  );
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const tabs = ["Summary", "Individual Responses", "Deleted"];
  // const [activeTab, setActiveTab] = useState("Individual Responses");
  const [activeTab, setActiveTab] = useState(() => {
    const urlTab = searchParams.get("tab");
    return urlTab ? urlTab : "Individual Responses";
  });
  const [currentUserResponse, setCurrentUserResponse] = useState(0);
  const [pagesNumber, setPagesNumber] = useState(1);
  const { data: response_ } = useGetUserSurveyResponseQuery(params.id);
  const { data: summary_ } = useGetSurveySummaryQuery(params.id, {
    skip: activeTab !== "Summary",
  });

  const answer_params = new URLSearchParams();
  // answer_params.set("answer", answer);
  console.log(answer_params.toString());

  const path_params: PathParamsProps = {};
  if (name) path_params.name = name;
  if (answer) path_params.answer = answer;
  if (question) path_params.question = question;
  if (questionType) path_params.question_type = questionType;
 

  console.log(path_params)

  const { data: respondent_name } = useGetRespondentNameQuery(params.id);
  const { data: validate_ } = useValidateSurveyResponseQuery(params.id);

  const queryArgs = {
    id: params.id,
    pagesNumber: pagesNumber,
    ...(Object.keys(path_params).length >= 3 ? path_params : {}),
  };
  
  const {
    data: validate_individual_response,
    isLoading,
    isSuccess,
    isError,
    refetch,
  } = useValidateIndividualResponseQuery(queryArgs);
  console.log(validate_individual_response);
  const validateSource =
    validate_individual_response?.data?.data &&
    validate_individual_response?.data?.data?.length > 0
      ? validate_individual_response?.data?.data[currentUserResponse]
      : validate_individual_response?.data;
  const { validCount, invalidCount } =
    calculateValidationCounts2(validateSource);
  console.log(validateSource);

  const totalResponses = validate_individual_response?.data?.total || 0;

  console.log(isLoading)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("tab", activeTab);
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    router.replace(newUrl); // Update the URL without reloading the page
  }, [activeTab, router]);

  useEffect(() => {
    if (name) {
      refetch();
    }
  }, [name, refetch]);


  useEffect(() => {
    if (answer && question && questionType) {
      refetch();
    }
  }, [answer, question, questionType, refetch]);


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

  useEffect(() => {
    const handleBeforeUnload = () => {
      dispatch(resetName());
      dispatch(resetFilters());
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const handleDeleteAResponse = async () => {
    try {
      console.log("Delete");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="lg:px-24">
      <ResponseHeader
        data={validate_individual_response?.data?.data?.length}
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        curerentSurvey={currentUserResponse + 1}
        handleNext={handleNext}
        handlePrev={handlePrev}
        respondent_data={respondent_name?.data}
        valid_response={validCount}
        invalid_response={invalidCount}
        deleteAResponse={handleDeleteAResponse}
        response_id={validateSource?._id}
        surveyData={validateSource}
      />
      <RespondentDetails
        data={validateSource}
        validCount={validCount}
        isLoading={isLoading}
      />
      {activeTab === "Individual Responses" && (
        <UserResponses
          data={validateSource}
          index={currentUserResponse}
          isLoading={isLoading}
          isSuccess={isSuccess}
          error={isError}
        />
      )}
      {userRoles.includes("Admin") && (
        <>
          {activeTab === "Summary" && (
            <div className="mt-2 min-h-[50vh]">
              <Suspense fallback={<div>Loading Summary...</div>}>
                <Summary result={summary_?.data} />
              </Suspense>
            </div>
          )}
        </>
      )}
      {activeTab === "Deleted" && (
        <div className="mt-2 min-h-[50vh]">
          <FeatureComing height="min-h-[20vh]" />
        </div>
      )}
    </div>
  );
};

export default Responses;
