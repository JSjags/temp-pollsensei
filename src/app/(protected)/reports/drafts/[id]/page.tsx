"use client";

import { ReportDraftData, ReportDraftPage } from "@/components/reports/components/drafts";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";

export default function Page() {
  const params = useParams() as { id?: string };
  const searchParams = useSearchParams();
  const id = params?.id ?? "";

  const queryTitle = searchParams.get("title") ?? "Untitled Draft";

  const report: ReportDraftData = {
    id,
    title: queryTitle,
    description: "",
    category: "",
    interests: [],
    thumbnailUrl: null,
    body: "",
  };

  return <ReportDraftPage report={report} />;
}

