"use client";

import { useState } from "react";

import { TUTORIAL_ENUM } from "@/services/api/constants.api";
import GenericArticlePage from "./GenericArticlePage";
import { useGetTutorials } from "@/hooks/useGetRequests";

const WebArticle = (): JSX.Element => {
  const [currentPage, setCurrentPage] = useState(1);

  const pageValue = useGetTutorials({
    filter: TUTORIAL_ENUM.web,
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

export default WebArticle;