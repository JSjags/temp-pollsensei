"use client";

import { useState } from "react";

import { useGetTutorials } from "@/hooks/useGetRequests";
import { TUTORIAL_ENUM } from "@/services/api/constants.api";
import GenericArticlePage from "./GenericArticlePage";

const TextTutorials = (): JSX.Element => {
  const [currentPage, setCurrentPage] = useState(1);

  const pageValue = useGetTutorials({
    filter: TUTORIAL_ENUM.text,
    page: currentPage,
  });

  return (
    <GenericArticlePage
      pageValue={pageValue}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
  );
};

export default TextTutorials;
