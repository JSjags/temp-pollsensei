"use client";

import { ComingSoon } from "@/components/reusable/coming-soon";
import LearningResources from "@/components/tutorials/LearningResources";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export default function Page() {
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <>
      <LearningResources />
    </>
  );
}
