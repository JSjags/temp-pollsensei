"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation"; // Add usePathname
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
  const pathname = usePathname();
  // const user = useSelector((state: RootState) => state.user.user);
  // const isPhoneVerified = (user as any)?.phoneVerified;
  const isPhoneVerified = useSelector(
    (state: RootState) => state.becomePaidRespondentSlice.isPhoneVerified
  );
  const isBecomeRespondentSurveyCompleted = useSelector(
    (state: RootState) =>
      state.becomePaidRespondentSlice.isBecomeRespondentSurveyCompleted
  );

  const { data: isPaidRespondent, isLoading } = useQuery({
    queryKey: [...[APP_KEYS.IS_PAID_RESPONDENT]],
    queryFn: () => fetchPaidRespondentStatus(),
    enabled: true,
  });

  const isPaidRespondentStatus = isPaidRespondent?.isPaidRespondent;

  useEffect(() => {
    if (isLoading) return;

    if (isPaidRespondentStatus) {
      router.push("/dashboard");
      return;
    }

    if (isPhoneVerified && pathname === "/respondent-form/verify-phone") {
      router.push("/respondent-form");
    } else if (
      !isPhoneVerified &&
      pathname !== "/respondent-form/verify-phone"
    ) {
      router.push("/respondent-form/verify-phone");
    }

    if (isBecomeRespondentSurveyCompleted) {
      router.push("/dashboard");
    }
  }, [
    isPhoneVerified,
    isPaidRespondentStatus,
    router,
    pathname,
    isLoading,
    isBecomeRespondentSurveyCompleted,
  ]);

  return <>{children}</>;
};

export default ProtectedSurveyRoute;
