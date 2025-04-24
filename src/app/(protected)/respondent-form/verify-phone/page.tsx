"use client";
import ProtectedSurveyRoute from "@/subpages/respondent-form/ProtectedSurveyRoute";
import PhoneVerification from "@/subpages/respondent-form/PhoneVerification";

const page = () => {
  return (
    <ProtectedSurveyRoute>
      <div className="w-[100vw] lg:w-full h-full overflow-hidden px-5">
        <PhoneVerification />
      </div>
    </ProtectedSurveyRoute>
  );
};

export default page;
