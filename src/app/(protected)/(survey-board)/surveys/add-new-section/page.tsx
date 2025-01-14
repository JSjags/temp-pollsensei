"use client";

import { RootState } from "@/redux/store";
import CreateNewSection from "@/subpages/survey/CreateNewSection";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

type Props = {};

const Page = (props: Props) => {
  const router = useRouter();
  const surveySection = useSelector(
    (state: RootState) => state.survey.sections
  );
  if (surveySection.length === 0) {
    router.push("/surveys/create-survey");
    return null;
  }
  return <CreateNewSection />;
};

export default Page;
