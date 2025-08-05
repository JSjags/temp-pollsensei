// "use client";

// import { useSearchParams, useParams, useRouter } from "next/navigation";
// import { ExternalLink, Loader2 } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import DOMPurify from "dompurify";
// import mammoth from "mammoth";
// import dynamic from "next/dynamic";

// // Dynamically import Quill (to avoid SSR crash)
// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
// import "react-quill/dist/quill.snow.css";
// import {
//   Breadcrumbs,
//   Crumb,
//   EditorPanel,
//   ReportFormState,
// } from "@/components/reports/components/drafts";
// import {
//   useReportCategory,
//   useReportInterests,
// } from "@/components/reports/queries/useCategories";
// import { Button } from "@/components/ui/button";
// import { LoadingSpinner } from "@/components/shop/components/dialogs/BuyPollcoins/CheckoutDialog";
// import { toast } from "react-toastify";
// import axiosInstance from "@/lib/axios-instance";
// import { PublishReportPayload } from "@/components/reports/queries/usePostOnboard";

// const defaultCategories = [
//   { value: "health", label: "Health" },
//   { value: "finance", label: "Finance" },
//   { value: "education", label: "Education" },
//   { value: "politics", label: "Politics" },
// ];

// const defaultInterests = [
//   { value: "students", label: "Students" },
//   { value: "teachers", label: "Teachers" },
//   { value: "parents", label: "Parents" },
// ];

// interface ReportData {
//   _id: string;
//   name: string;
//   status: string;
//   createdAt: string;
//   updatedAt: string;
//   url: string;
//   survey: {
//     description: string;
//     topic: string;
//     _id: string;
//   };
//   categoryId?: string;
//   interestIds?: string[];
// }
// export default function DraftPreviewPage() {
//   const searchParams = useSearchParams();
//   const { id } = useParams();
//   const router = useRouter();

//   const title = searchParams.get("title");
//   const url = searchParams.get("url");

//   const [docxError, setDocxError] = useState<string | null>(null);
//   const [quillContent, setQuillContent] = useState(
//     "<p>Your editable content here...</p>"
//   );
//   const [docxElements, setDocxElements] = useState<HTMLElement[]>([]);
//   const [showComparison, setShowComparison] = useState(true);
//   const [reportData, setReportData] = useState<ReportData | null>(null);
//   const [reportId, setReportId] = useState<string>("");
//   const [isPublishing, setIsPublishing] = useState(false);
//   const [reportUrl, setReportUrl] = useState<string>("");
//   const [formState, setFormState] = useState<ReportFormState>({
//     title: "",
//     description: "",
//     category: "",
//     interests: [],
//     thumbnailUrl: "",
//   });
//   const [isLoading, setIsLoading] = useState(true);

//   const { data: categoriesData, isLoading: categoriesLoading } =
//     useReportCategory();
//   const { data: interestsData, isLoading: interestsLoading } =
//     useReportInterests();

//   const categoryOptions = React.useMemo(() => {
//     if (Array.isArray(categoriesData) && categoriesData.length > 0) {
//       return categoriesData.map((c) => ({
//         value: c._id,
//         label: c.name || "Unnamed",
//       }));
//     }
//     return defaultCategories;
//   }, [categoriesData]);

//   const interestsOptions = React.useMemo(() => {
//     if (Array.isArray(interestsData) && interestsData.length > 0) {
//       return interestsData.map((i) => ({
//         value: i._id,
//         label: i.name || "Unnamed",
//       }));
//     }
//     return defaultInterests;
//   }, [interestsData]);

//   const handlePublishReport = async () => {
//     if (
//       !formState.title ||
//       !formState.description ||
//       !formState.category ||
//       !formState.interests.length ||
//       !formState.thumbnailUrl
//     ) {
//       toast.error("Please fill all required fields before publishing");
//       return;
//     }

//     setIsPublishing(true);

//     try {
//       const payload: PublishReportPayload = {
//         report_id: reportId,
//         title: formState.title,
//         description: formState.description,
//         categories: [formState.category],
//         fields_of_interest: formState.interests,
//         summarized_by: "manual",
//         content: quillContent,
//         thumbnail: formState.thumbnailUrl,
//       };

//       const response = await axiosInstance.post("/report", payload);

//       console.log("Report published successfully:", response);

//       toast.success("Post created successfully!");
//       router.push(`/reports/preview/${response.data._id}`);
//     } catch (error: any) {
//       console.error("Error publishing report:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         "Failed to publish report. Please try again.";
//       toast.error(errorMessage);
//     } finally {
//       setIsPublishing(false);
//     }
//   };

//   const handleEditorPanelChange = (partial: Partial<ReportFormState>) => {
//     // Update formState
//     setFormState((prev) => ({
//       ...prev,
//       ...partial,
//     }));

//     // Also update reportData for title and description to maintain consistency
//     if (partial.title !== undefined) {
//       setReportData((prev: any) => ({
//         ...prev,
//         name: partial.title,
//       }));
//     }

//     if (partial.description !== undefined) {
//       setReportData((prev: any) => ({
//         ...prev,
//         survey: {
//           ...prev?.survey,
//           description: partial.description,
//         },
//       }));
//     }
//   };
//   useEffect(() => {
//     if (reportData) {
//       setFormState((prev) => ({
//         ...prev,
//         title: reportData?.name || "",
//         description: reportData?.survey?.description || "",
//         // Initialize with existing IDs if available
//         category: reportData?.categoryId || "",
//         interests: reportData?.interestIds || [],
//       }));
//     }
//   }, [reportData]);
//   const crumbs: Crumb[] = [
//     { label: "Reports", href: "/reports" },
//     { label: "My Reports", href: "/reports" },
//     { label: "Draft", onClick: () => router.back() },
//     { label: reportData?.name || "Untitled" },
//   ];

//   const fetchReportData = async (id: string) => {
//     try {
//       setReportData({
//         _id: "687e3c390110af1da4840815",
//         name: "My first duplicate",
//         status: "draft",
//         createdAt: "2025-07-21T13:10:17.756Z",
//         updatedAt: "2025-07-22T15:50:56.389Z",
//         url: reportUrl,
//         survey: {
//           description:
//             "This survey aims to gather public opinions on the Nigeria Police Force's performance, trust, accountability, community engagement, and suggestions for improvement.",
//           topic: "Public Perception of Nigeria Police: Liability or Asset?",
//           _id: "6877de769a7f4fc9902203e6",
//         },
//       });
//     } catch (error) {
//       console.error("Error fetching report data:", error);
//     }
//   };
//   useEffect(() => {
//     if (reportId) {
//       fetchReportData(reportId);
//     }
//   }, [reportId]);

//   // Parse and extract all elements for rendering

//   const parseDocxHtml = (html: string) => {
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(html, "text/html");

//     // Get all elements and filter
//     const elements = Array.from(
//       doc.body.children as HTMLCollectionOf<HTMLElement>
//     ).filter((el) => {
//       // Skip empty elements and specific tags
//       return (
//         el.innerHTML.trim() !== "" &&
//         !["script", "style"].includes(el.tagName.toLowerCase())
//       );
//     });

//     setDocxElements(elements);
//   };
//   // Handle import button clicks
//   const handleImportClick = (element: HTMLElement) => {
//     const htmlContent = element.outerHTML;
//     setQuillContent((prev) => prev + htmlContent);
//   };

//   // Get URL parameters
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const urlParams = new URLSearchParams(window.location.search);
//       const pathSegments = window.location.pathname.split("/");

//       const id = pathSegments[pathSegments.length - 1];
//       const reportUrlParam = urlParams.get("url");

//       if (id && id !== "draft") {
//         setReportId(id);
//       }
//       if (reportUrlParam) {
//         const decodedUrl = decodeURIComponent(reportUrlParam);
//         setReportUrl(decodedUrl);
//       }
//       setIsLoading(false);
//     }
//   }, []);
//   useEffect(() => {
//     const fetchDocx = async () => {
//       if (!url) return;

//       try {
//         const response = await fetch(url);
//         const arrayBuffer = await response.arrayBuffer();

//         const { value: rawHtml } = await mammoth.convertToHtml({ arrayBuffer });
//         const cleanHtml = DOMPurify.sanitize(rawHtml);
//         parseDocxHtml(cleanHtml);
//       } catch (err: any) {
//         console.error("Failed to load DOCX:", err);
//         setDocxError("Failed to load report content.");
//       }
//     };

//     fetchDocx();
//   }, [url]);

//   return (
//     <div className="flex min-h-screen flex-col">
//       <div className="bg-white border-b px-6 py-4 flex items-center justify-between flex-shrink-0">
//         <div className="flex items-center space-x-4">
//           <div className="text-sm text-gray-500">
//             <Breadcrumbs items={crumbs} />
//           </div>
//         </div>
//         <div className="flex items-center space-x-4">
//           <button
//             onClick={() => setShowComparison(!showComparison)}
//             className="text-tertiary hover:text-tertiary/85 flex items-center space-x-2 text-sm"
//           >
//             <span>
//               {showComparison
//                 ? "🗙 Close Report Comparison"
//                 : "↔ Compare Reports"}
//             </span>
//           </button>
//         </div>
//       </div>

//       <div className="w-full flex overflow-hidden">
//         {/* Left: Editor */}
//         <div className="w-1/2 border-r p-6 overflow-y-auto">
//           <h2 className="text-xl font-bold mb-4">Draft Editor</h2>

//           <ReactQuill
//             theme="snow"
//             value={quillContent}
//             onChange={setQuillContent}
//             className="bg-white min-h-[900px]"
//           />
//         </div>

//         {/* Right: DOCX Preview */}
//         <div className="w-1/2 p-6 overflow-y-auto bg-white">
//           <div className="border-b p-4 flex-shrink-0">
//             <div className="flex items-center justify-between mb-3">
//               <h2 className="text-xl font-bold mb-4">
//                 {title || "Draft Preview"}
//               </h2>
//               <div className="flex items-center space-x-2">
//                 <Button
//                   variant={"gradient"}
//                   onClick={handlePublishReport}
//                   disabled={
//                     !formState.thumbnailUrl ||
//                     !formState.interests.length ||
//                     !formState.category ||
//                     !formState.title ||
//                     !formState.description ||
//                     isPublishing ||
//                     quillContent.length === 0
//                   }
//                   className="flex items-center space-x-1 text-white rounded transition-colors"
//                 >
//                   {isPublishing && <LoadingSpinner />}
//                   <ExternalLink className="w-3 h-3" />
//                   <span>Create</span>
//                 </Button>
//                 {/* <Button
//                   variant={"secondary"}
//                   onClick={handleDownloadReport}
//                   className="flex items-center space-x-1 px-3 py-1.5 h-10 rounded transition-colors"
//                 >
//                   <Download className="w-3 h-3" />
//                   <span>Download</span>
//                 </Button> */}
//               </div>
//             </div>
//             <p className="text-sm text-gray-600">
//               Here&apos;s the report and AI-generated insights for your survey
//             </p>
//           </div>

//           {docxError && <p className="text-red-500">{docxError}</p>}
//           {!docxError && !docxElements.length && (
//             <div className="flex items-center justify-center gap-2 text-black h-[800px]">
//               <Loader2 className="animate-spin w-4 h-4" />
//               <span>Loading document...</span>
//             </div>
//           )}
//           {showComparison ? (
//             <>
//               {docxElements.length > 0 && (
//                 <div className="prose max-w-none">
//                   {docxElements.map((element, index) => (
//                     <div
//                       key={index}
//                       className="relative inline-block hover:bg-gray-100 cursor-pointer"
//                       style={{ marginBottom: "1rem" }}
//                     >
//                       <div
//                         dangerouslySetInnerHTML={{ __html: element.outerHTML }}
//                       />
//                       <button
//                         onClick={() => handleImportClick(element)}
//                         className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity duration-200"
//                       >
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="24"
//                           height="24"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           className="lucide lucide-chevrons-left-icon lucide-chevrons-left"
//                         >
//                           <path d="m11 17-5-5 5-5" />
//                           <path d="m18 17-5-5 5-5" />
//                         </svg>
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </>
//           ) : (
//             <EditorPanel
//               state={formState}
//               onChange={handleEditorPanelChange}
//               categories={categoryOptions}
//               categoriesLoading={categoriesLoading}
//               interestsOptions={interestsOptions}
//               interestsLoading={interestsLoading}
//               reportId={reportId}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useSearchParams, useParams, useRouter } from "next/navigation";
import { ExternalLink, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import mammoth from "mammoth";
import dynamic from "next/dynamic";

// Dynamically import Quill (to avoid SSR crash)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import {
  Breadcrumbs,
  Crumb,
  EditorPanel,
  ReportFormState,
} from "@/components/reports/components/drafts";
import {
  useReportCategory,
  useReportInterests,
} from "@/components/reports/queries/useCategories";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shop/components/dialogs/BuyPollcoins/CheckoutDialog";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axios-instance";
import { PublishReportPayload } from "@/components/reports/queries/usePostOnboard";

const defaultCategories = [
  { value: "health", label: "Health" },
  { value: "finance", label: "Finance" },
  { value: "education", label: "Education" },
  { value: "politics", label: "Politics" },
];

const defaultInterests = [
  { value: "students", label: "Students" },
  { value: "teachers", label: "Teachers" },
  { value: "parents", label: "Parents" },
];

interface ReportData {
  _id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  url: string;
  survey: {
    description: string;
    topic: string;
    _id: string;
  };
  categoryId?: string;
  interestIds?: string[];
}
export default function DraftPreviewPage() {
  const searchParams = useSearchParams();
  const { id } = useParams();
  const router = useRouter();

  const title = searchParams.get("title");
  const url = searchParams.get("url");

  const [docxError, setDocxError] = useState<string | null>(null);
  const [quillContent, setQuillContent] = useState(
    "<p>Your editable content here...</p>"
  );
  const [docxElements, setDocxElements] = useState<HTMLElement[]>([]);
  const [showComparison, setShowComparison] = useState(true);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [reportId, setReportId] = useState<string>("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [reportUrl, setReportUrl] = useState<string>("");
  const [formState, setFormState] = useState<ReportFormState>({
    title: "",
    description: "",
    category: "",
    interests: [],
    thumbnailUrl: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const { data: categoriesData, isLoading: categoriesLoading } =
    useReportCategory();
  const { data: interestsData, isLoading: interestsLoading } =
    useReportInterests();

  const categoryOptions = React.useMemo(() => {
    if (Array.isArray(categoriesData) && categoriesData.length > 0) {
      return categoriesData.map((c) => ({
        value: c._id,
        label: c.name || "Unnamed",
      }));
    }
    return defaultCategories;
  }, [categoriesData]);

  const interestsOptions = React.useMemo(() => {
    if (Array.isArray(interestsData) && interestsData.length > 0) {
      return interestsData.map((i) => ({
        value: i._id,
        label: i.name || "Unnamed",
      }));
    }
    return defaultInterests;
  }, [interestsData]);

  const handlePublishReport = async () => {
    if (
      !formState.title ||
      !formState.description ||
      !formState.category ||
      !formState.interests.length ||
      !formState.thumbnailUrl
    ) {
      toast.error("Please fill all required fields before publishing");
      return;
    }

    setIsPublishing(true);

    try {
      const payload: PublishReportPayload = {
        report_id: reportId,
        title: formState.title,
        description: formState.description,
        categories: [formState.category],
        fields_of_interest: formState.interests,
        summarized_by: "manual",
        content: quillContent,
        thumbnail: formState.thumbnailUrl,
      };

      const response = await axiosInstance.post("/report", payload);

      console.log("Report published successfully:", response);

      toast.success("Post created successfully!");
      router.push(`/reports/preview/${response.data._id}`);
    } catch (error: any) {
      console.error("Error publishing report:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to publish report. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleEditorPanelChange = (partial: Partial<ReportFormState>) => {
    // Update formState
    setFormState((prev) => ({
      ...prev,
      ...partial,
    }));

    // Also update reportData for title and description to maintain consistency
    if (partial.title !== undefined) {
      setReportData((prev: any) => ({
        ...prev,
        name: partial.title,
      }));
    }

    if (partial.description !== undefined) {
      setReportData((prev: any) => ({
        ...prev,
        survey: {
          ...prev?.survey,
          description: partial.description,
        },
      }));
    }
  };
  useEffect(() => {
    if (reportData) {
      setFormState((prev) => ({
        ...prev,
        title: reportData?.name || "",
        description: reportData?.survey?.description || "",
        // Initialize with existing IDs if available
        category: reportData?.categoryId || "",
        interests: reportData?.interestIds || [],
      }));
    }
  }, [reportData]);
  const crumbs: Crumb[] = [
    { label: "Reports", href: "/reports" },
    { label: "My Reports", href: "/reports" },
    { label: "Draft", onClick: () => router.back() },
    { label: reportData?.name || "Untitled" },
  ];

  const fetchReportData = async (id: string) => {
    try {
      setReportData({
        _id: "687e3c390110af1da4840815",
        name: "My first duplicate",
        status: "draft",
        createdAt: "2025-07-21T13:10:17.756Z",
        updatedAt: "2025-07-22T15:50:56.389Z",
        url: reportUrl,
        survey: {
          description:
            "This survey aims to gather public opinions on the Nigeria Police Force's performance, trust, accountability, community engagement, and suggestions for improvement.",
          topic: "Public Perception of Nigeria Police: Liability or Asset?",
          _id: "6877de769a7f4fc9902203e6",
        },
      });
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };
  useEffect(() => {
    if (reportId) {
      fetchReportData(reportId);
    }
  }, [reportId]);

  // Parse and extract all elements for rendering

  const parseDocxHtml = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Get all elements and filter
    const elements = Array.from(
      doc.body.children as HTMLCollectionOf<HTMLElement>
    ).filter((el) => {
      // Skip empty elements and specific tags
      return (
        el.innerHTML.trim() !== "" &&
        !["script", "style"].includes(el.tagName.toLowerCase())
      );
    });

    setDocxElements(elements);
  };
  // Handle import button clicks
  const handleImportClick = (element: HTMLElement) => {
    const htmlContent = element.outerHTML;
    setQuillContent((prev) => prev + htmlContent);
  };

  // Get URL parameters
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const pathSegments = window.location.pathname.split("/");

      const id = pathSegments[pathSegments.length - 1];
      const reportUrlParam = urlParams.get("url");

      if (id && id !== "draft") {
        setReportId(id);
      }
      if (reportUrlParam) {
        const decodedUrl = decodeURIComponent(reportUrlParam);
        setReportUrl(decodedUrl);
      }
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    const fetchDocx = async () => {
      if (!url) return;

      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();

        const { value: rawHtml } = await mammoth.convertToHtml({ arrayBuffer });
        const cleanHtml = DOMPurify.sanitize(rawHtml);
        parseDocxHtml(cleanHtml);
      } catch (err: any) {
        console.error("Failed to load DOCX:", err);
        setDocxError("Failed to load report content.");
      }
    };

    fetchDocx();
  }, [url]);

  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            <Breadcrumbs items={crumbs} />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="text-tertiary hover:text-tertiary/85 flex items-center space-x-2 text-sm"
          >
            <span>
              {showComparison
                ? "🗙 Close Report Comparison"
                : "↔ Compare Reports"}
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Area with Independent Scrolling */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Editor Panel */}
        <div className="w-1/2 border-r flex flex-col">
          <div className="p-6 border-b bg-white flex-shrink-0">
            <h2 className="text-xl font-bold">Draft Editor</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-6 bg-white">
            <ReactQuill
              theme="snow"
              value={quillContent}
              onChange={setQuillContent}
              className="bg-white"
              style={{ height: 'calc(100vh - 200px)' }}
            />
          </div>
        </div>

        {/* Right: Preview/Editor Panel */}
        <div className="w-1/2 flex flex-col bg-white">
          {/* Fixed Header for Right Panel */}
          <div className="border-b p-4 flex-shrink-0 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold">
                {title || "Draft Preview"}
              </h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant={"gradient"}
                  onClick={handlePublishReport}
                  disabled={
                    !formState.thumbnailUrl ||
                    !formState.interests.length ||
                    !formState.category ||
                    !formState.title ||
                    !formState.description ||
                    isPublishing ||
                    quillContent.length === 0
                  }
                  className="flex items-center space-x-1 text-white rounded transition-colors"
                >
                  {isPublishing && <LoadingSpinner />}
                  <ExternalLink className="w-3 h-3" />
                  <span>Create</span>
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Here&apos;s the report and AI-generated insights for your survey
            </p>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {docxError && <p className="text-red-500">{docxError}</p>}
            {!docxError && !docxElements.length && (
              <div className="flex items-center justify-center gap-2 text-black h-full">
                <Loader2 className="animate-spin w-4 h-4" />
                <span>Loading document...</span>
              </div>
            )}
            {showComparison ? (
              <>
                {docxElements.length > 0 && (
                  <div className="prose max-w-none">
                    {docxElements.map((element, index) => (
                      <div
                        key={index}
                        className="relative inline-block hover:bg-gray-100 cursor-pointer"
                        style={{ marginBottom: "1rem" }}
                      >
                        <div
                          dangerouslySetInnerHTML={{ __html: element.outerHTML }}
                        />
                        <button
                          onClick={() => handleImportClick(element)}
                          className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity duration-200"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-chevrons-left-icon lucide-chevrons-left"
                          >
                            <path d="m11 17-5-5 5-5" />
                            <path d="m18 17-5-5 5-5" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <EditorPanel
                state={formState}
                onChange={handleEditorPanelChange}
                categories={categoryOptions}
                categoriesLoading={categoriesLoading}
                interestsOptions={interestsOptions}
                interestsLoading={interestsLoading}
                reportId={reportId}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}