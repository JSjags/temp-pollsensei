"use client";

import FeatureComing from "@/components/common/FeatureComing";
import EditCreatedSurvey from "@/subpages/survey/EditCreatedSurvey";
import EditSubmittedSurvey from "@/subpages/survey/EditSubmittedSurvey";

type Props = {};

const Page = (props: Props) => {
  return (
    <>
      <EditSubmittedSurvey />
      {/* <FeatureComing/> */}
      {/* <EditCreatedSurvey /> */}
    </>
  );
};

export default Page;
