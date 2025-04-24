"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface ProtectedSurveyRouteProps {
  children: React.ReactNode;
}

const ProtectedSurveyRoute: React.FC<ProtectedSurveyRouteProps> = ({
  children,
}) => {
  const router = useRouter();
  const isPhoneVerified = useSelector(
    (state: RootState) => state.becomePaidRespondentSlice.isPhoneVerified
  );
  const isBecomeRespondentSurveyCompleted = useSelector(
    (state: RootState) =>
      state.becomePaidRespondentSlice.isBecomeRespondentSurveyCompleted
  );

  useEffect(() => {
    const currentPath = window.location.pathname;

    if (isPhoneVerified) {
      // If the phone is verified, allow access to /respondent-form
      if (currentPath === "/respondent-form/verify-phone") {
        router.push("/respondent-form");
      }
    } else {
      // If the phone is not verified, redirect to /respondent-form/verify-phone
      if (currentPath !== "/respondent-form/verify-phone") {
        router.push("/respondent-form/verify-phone");
      }
    }

    if (isBecomeRespondentSurveyCompleted) {
      // If the survey is completed, redirect to /dashboard
      router.push("/dashboard");
    }
  }, [isPhoneVerified, isBecomeRespondentSurveyCompleted, router]);

  return <>{isPhoneVerified && children}</>;
};

export default ProtectedSurveyRoute;
