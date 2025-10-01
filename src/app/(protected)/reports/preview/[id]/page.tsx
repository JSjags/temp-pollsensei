"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import DOMPurify from "dompurify";
import { usePreviewReportById } from "@/components/reports/queries/useCategories";
import { Button } from "@/components/ui/button";
import mammoth from "mammoth";
import React, { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/shop/components/dialogs/BuyPollcoins/CheckoutDialog";
import { ScrollArea } from "@/components/ui/scrollarea";




export default function ReportPreviewPage() {
  const { id } = useParams();
  const reportId = id as string;
  const { data, isLoading, isError, error } = usePreviewReportById(reportId);
  const [docxHtml, setDocxHtml] = useState<string | null>(null);
  const [docxError, setDocxError] = useState<string | null>(null);
  const router = useRouter();
  const [isRouting, setIsRouting] = React.useState(false);
  const reportMeta = data?.report;


  const pushToDraft = React.useCallback(() => {
    if (isRouting) return;
    setIsRouting(true);
    router.push(
      `/reports/drafts/${reportId}?title=${encodeURIComponent(
        reportMeta.name
      )}&url=${encodeURIComponent(reportMeta.url)}`
    );
  }, [isRouting, router, reportId, reportMeta?.name, reportMeta?.url]);
  useEffect(() => {
    const loadDocx = async () => {
      if (data?.report?.url) {
        try {
          const response = await fetch(data.report.url);
          const arrayBuffer = await response.arrayBuffer();

          const { value: rawHtml } = await mammoth.convertToHtml({
            arrayBuffer,
          });
          const cleanHtml = DOMPurify.sanitize(rawHtml);

          setDocxHtml(cleanHtml);
        } catch (err: any) {
          console.error("Failed to load DOCX:", err);
          setDocxError("Failed to load report content.");
        }
      }
    };

    loadDocx();
  }, [data?.report?.url]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <LoadingSpinner />
      </div>
    );
  }

  const Header = () => {
    return (
      <div className="mb-6 w-full flex items-center justify-between sticky top-0 backdrop-blur px-6 py-3 z-10 border-b">
        <div
          onClick={() => router.back()}
          className="flex items-center cursor-pointer hover:text-tertiary transition-colors duration-200 ease-in-out"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="ml-2 text-lg font-medium">
            {data?.report?.name || "Report Preview"}
          </span>
        </div>

        <Button onClick={pushToDraft} variant="gradient" className="rounded-md">
          Create Post
        </Button>
      </div>
    );
  };

  if (isError) {
    return (
      <div className="text-center text-red-500 mt-12">
        Failed to load report: {(error as Error)?.message ?? "Unknown error"}
      </div>
    );
  }

  return (
    <div className="w-full relative pb-24 overflow-hidden h-[calc(100vh-124px)]">
      <Header />
      <ScrollArea.Root className="max-w-4xl mx-auto py-10 px-6 overflow-y-auto bg-white">
        <>
          <h1 className="text-2xl font-bold mb-4">{data.report.name}</h1>
          <p className="text-gray-600 text-sm mb-4">
            Created: {new Date(data.report.createdAt).toLocaleDateString()}
          </p>

          {docxError && <p className="text-red-500">{docxError}</p>}
          {!docxError && !docxHtml && (
            <div className="text-black">Loading document...</div>
          )}

          {docxHtml && (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: docxHtml }}
            />
          )}
        </>
      </ScrollArea.Root>
    </div>
  );
}
