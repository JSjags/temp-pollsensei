"use client";
import ProtectedSurveyRoute from "@/subpages/respondent-form/ProtectedSurveyRoute";
import RespondentForm from "@/subpages/respondent-form/RespondentForm";

const page = () => {
  return (
    <ProtectedSurveyRoute>
      <div className="w-[100vw] lg:w-full h-full overflow-hidden px-5">
        <RespondentForm />
      </div>
    </ProtectedSurveyRoute>
  );
};

export default page;
