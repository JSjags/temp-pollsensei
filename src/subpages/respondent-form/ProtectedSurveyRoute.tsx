"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useQuery } from "@tanstack/react-query";
import { fetchPaidRespondentStatus } from "@/services/api/apiRequest";
import { APP_KEYS } from "@/constants";

interface ProtectedSurveyRouteProps {
  children: React.ReactNode;
}

const ProtectedSurveyRoute: React.FC<ProtectedSurveyRouteProps> = ({
  children,
}) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);
  const userAccessToken = useSelector(
    (state: RootState) => state.user.access_token
  );
  const isPhoneVerified = (user as any)?.phoneVerified;

  const { data: isPaidRespondent } = useQuery({
    queryKey: [...[APP_KEYS.IS_PAID_RESPONDENT], userAccessToken],
    queryFn: () => fetchPaidRespondentStatus(userAccessToken),
    enabled: !!userAccessToken,
  });

  const isPaidRespondentStatus = isPaidRespondent?.data?.isPaidRespondent;

  useEffect(() => {
    const currentPath = window.location.pathname;

    if (isPhoneVerified) {
      if (currentPath === "/respondent-form/verify-phone") {
        router.push("/respondent-form");
      }
    } else {
      if (currentPath !== "/respondent-form/verify-phone") {
        router.push("/respondent-form/verify-phone");
      }
    }

    if (isPaidRespondentStatus) {
      router.push("/dashboard");
    }
  }, [isPhoneVerified, isPaidRespondentStatus, router]);

  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";

  const shouldRenderChildren = () => {
    if (isPaidRespondentStatus) return false;
    if (currentPath === "/respondent-form/verify-phone") {
      return !isPhoneVerified;
    }
    if (currentPath === "/respondent-form") {
      return isPhoneVerified;
    }

    return false;
  };

  return <>{shouldRenderChildren() && children}</>;
};

export default ProtectedSurveyRoute;
