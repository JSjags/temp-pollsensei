"use client";
import { RootState } from "@/redux/store";
import SurveyResponses from "@/subpages/survey/SurveyResponses";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

type Props = {};

const Page = (props: Props) => {
  const router = useRouter()
  const surveySection = useSelector((state:RootState)=>state.survey.sections)
  // if(surveySection.length === 0){
  //   router.push('/surveys')
  //   return null;
  // }
  return(
    <SurveyResponses />
  );
};

export default Page;
