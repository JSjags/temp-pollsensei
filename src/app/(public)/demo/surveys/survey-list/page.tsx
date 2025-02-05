"use client";

import dynamic from "next/dynamic";

// Dynamically import CreatedSurveysPage with SSR disabled
const CreatedSurveysPage = dynamic(
  () => import("@/subpages/survey/CreatedSurveysPage"),
  { ssr: false }
);

type Props = {};

const Page = (props: Props) => {
  return <CreatedSurveysPage />;
};

export default Page;
