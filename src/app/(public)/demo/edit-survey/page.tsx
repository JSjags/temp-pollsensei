import EditSurvey from "@/subpages/survey/EditSurvey";
type Props = {};

const Page = (props: Props) => {
  // if(surveySection.length === 0){
  //   router.push("/surveys/survey-list");
  //   return null;
  // }
  return <EditSurvey />;
};

export default Page;
