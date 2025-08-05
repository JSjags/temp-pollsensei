"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import DOMPurify from "dompurify";
import { usePreviewReportById } from "@/components/reports/queries/useCategories";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { usePublishReports } from "@/components/reports/queries/usePublishReports";
import Image from "next/image";
import mammoth from "mammoth";
import React, { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/shop/components/dialogs/BuyPollcoins/CheckoutDialog";
import { ScrollArea } from "@/components/ui/scrollarea";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PublishDialog } from "@/components/reports/components/dialogs/publish";

// Define interfaces for the content structure (based on Editor.js format)
interface BlockData {
  text?: string; // For paragraph blocks
  // Add other data properties for different block types if needed (e.g., url for images)
}

interface Block {
  id: string;
  type: string;
  data: BlockData;
}

interface EditorContent {
  time: number;
  blocks: Block[];
  version: string;
}

export default function ReportPreviewPage() {
  const { id } = useParams();
  const reportId = id as string;
  const publishMutation = usePublishReports();
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

  // const handlePublish = () => {
  //   if (!post._id) return;

  //   publishMutation.mutate(post._id, {
  //     onSuccess: (updatedPost: any) => {
  //       if (updatedPost.status === "published") {
  //         toast.success("Report published successfully!");
  //       } else if (updatedPost.status === "draft") {
  //         toast.success("Report unpublished successfully!");
  //       } else {
  //         toast.success("Report status updated.");
  //       }
  //       router.push("/reports");
  //     },
  //     onError: (error: any) => {
  //       toast.error(
  //         error?.response?.data?.message || "Failed to update report status"
  //       );
  //     },
  //   });
  // };

  // Function to determine if content is JSON or HTML
  // const isJsonContent = (content: string): boolean => {
  //   try {
  //     const parsed = JSON.parse(content);
  //     return parsed && typeof parsed === "object" && parsed.blocks;
  //   } catch {
  //     return false;
  //   }
  // };

  // Parse content based on its format
  // const renderContent = () => {
  //   if (!post?.content) {
  //     return <p>No content available.</p>;
  //   }

  //   // Check if content is JSON (Editor.js format) or HTML
  //   if (isJsonContent(post.content)) {
  //     // Handle Editor.js JSON format
  //     try {
  //       const parsedContent: EditorContent = JSON.parse(post.content);
  //       const contentBlocks = parsedContent.blocks || [];

  //       return contentBlocks.length > 0 ? (
  //         contentBlocks.map((block) => renderBlock(block))
  //       ) : (
  //         <p>No content available.</p>
  //       );
  //     } catch (err) {
  //       console.error("Failed to parse JSON content:", err);
  //       return <p>Failed to parse content.</p>;
  //     }
  //   } else {
  //     // Handle HTML content
  //     const sanitizedHtml = DOMPurify.sanitize(post.content, {
  //       ALLOWED_TAGS: [
  //         "p",
  //         "br",
  //         "strong",
  //         "b",
  //         "em",
  //         "i",
  //         "u",
  //         "a",
  //         "h1",
  //         "h2",
  //         "h3",
  //         "h4",
  //         "h5",
  //         "h6",
  //         "ul",
  //         "ol",
  //         "li",
  //         "blockquote",
  //         "img",
  //         "div",
  //         "span",
  //       ],
  //       ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "id", "style"],
  //     });

  //     return (
  //       <div
  //         className="prose max-w-none"
  //         dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
  //       />
  //     );
  //   }
  // };

  // Render each block based on its type (for Editor.js format)
  // const renderBlock = (block: Block) => {
  //   const { id, type, data } = block;

  //   switch (type) {
  //     case "paragraph":
  //       // Sanitize the text to prevent XSS
  //       const sanitizedText = DOMPurify.sanitize(data.text || "", {
  //         ALLOWED_TAGS: ["b", "i", "u", "a", "strong", "em"],
  //         ALLOWED_ATTR: ["href"],
  //       });
  //       return (
  //         <p key={id} dangerouslySetInnerHTML={{ __html: sanitizedText }} />
  //       );

  //     // Add more cases for other block types (e.g., header, list, image) as needed
  //     default:
  //       return null;
  //   }
  // };

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
