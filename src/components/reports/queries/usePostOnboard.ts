import axiosInstance from "@/lib/axios-instance";
import { postOnboardData } from "@/lib/report";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";


// export interface ReportMediaUploadResponse {
//   // Adapt to your API
//   success: boolean;
//   message?: string;
//   media?: Array<{
//     id: string;
//     url: string;
//     filename: string;
//     mimeType: string;
//     size: number;
//     // add any other fields returned by backend
//   }>;
// }

// export interface ReportMediaUploadVariables {
//   reportId: string;
//   files: File[];             // one or more File objects from <input type="file" />
//   // Optional additional form fields if backend needs them
//   // e.g. {caption: string} or {categoryId: string}
//   extraFields?: Record<string, string | Blob | number | boolean | null | undefined>;
// }
// export const useReportMediaUpload = () => {
//   const queryClient = useQueryClient();
//   const [progress, setProgress] = React.useState<number>(0);

//   const mutation = useMutation<
//     ReportMediaUploadResponse,
//     Error,
//     ReportMediaUploadVariables
//   >({
//     mutationFn: async ({
//       reportId,
//       files,
//       extraFields,
//     }: ReportMediaUploadVariables): Promise<ReportMediaUploadResponse> => {
//       const formData = new FormData();
//       formData.append("report_id", reportId);

//       // Append all files. Server field name may differ: "files", "media", etc.
//       files.forEach((file) => {
//         formData.append("files", file);
//       });

//       // Optional extra fields
//       if (extraFields) {
//         Object.entries(extraFields).forEach(([key, value]) => {
//           if (value === undefined || value === null) return;
//           formData.append(key, String(value));
//         });
//       }

//       const res = await axiosInstance.post<ReportMediaUploadResponse>(
//         "/report/upload-media",
//         formData,
//         {
//           headers: {
//             // Let Axios set boundary automatically; specifying is optional but harmless:
//             "Content-Type": "multipart/form-data",
//           },
//           onUploadProgress: (evt) => {
//             if (!evt.total) return;
//             const pct = Math.round((evt.loaded * 100) / evt.total);
//             setProgress(pct);
//           },
//         }
//       );

//       if (!res.data) {
//         throw new Error("Failed to upload report media");
//       }
//       return res.data;
//     },

//     onSuccess: (data, variables) => {
//       // Invalidate anything that depends on the report or its media assets.
//       queryClient.invalidateQueries({ queryKey: ["report", variables.reportId] });
//       queryClient.invalidateQueries({
//         queryKey: ["report", variables.reportId, "media"],
//       });
//       // Reset progress for next upload (optional)
//       setProgress(0);
//     },

//     onError: () => {
//       // Reset or leave last progress? Here we reset.
//       setProgress(0);
//     },
//   });

//   return {
//     ...mutation,
//     progress, // 0-100
//   };
// };
export const usePostOnboard = () => {
  return useMutation({
    mutationFn: postOnboardData,
  });
};



export interface ReportMediaUploadResponse {
  success: boolean;
  message?: string;
  // Seen in some responses:
  data?: {
    url?: string;
    type?: string;
    [k: string]: any;
  };
  // Seen in other responses:
  media?: Array<{
    id?: string;
    url?: string;
    filename?: string;
    mimeType?: string;
    size?: number;
    [k: string]: any;
  }>;
  // Fallback:
  url?: string;
  [k: string]: any;
}

export interface ReportMediaUploadVariables {
  reportId: string;
  files: File[];
  extraFields?: Record<
    string,
    string | Blob | number | boolean | null | undefined
  >;
}

// Normalized for consumers
export interface NormalizedUploadResult {
  success: boolean;
  url: string | null;
  raw: ReportMediaUploadResponse;
}

const ENABLE_UPLOAD_DEBUG = true;

export const useReportMediaUpload = () => {
  const queryClient = useQueryClient();
  const [progress, setProgress] = React.useState<number>(0);

  const mutation = useMutation<
    ReportMediaUploadResponse,
    Error,
    ReportMediaUploadVariables
  >({
    mutationFn: async ({
      reportId,
      files,
      extraFields,
    }: ReportMediaUploadVariables): Promise<ReportMediaUploadResponse> => {
      const formData = new FormData();

      // REQUIRED: backend expects report_id
      formData.append("report_id", reportId);

      // BACKEND MAY EXPECT 'files' EVEN FOR SINGLE UPLOAD
      files.forEach((file) => {
        formData.append("files", file);
      });

      // Extra fields
      if (extraFields) {
        Object.entries(extraFields).forEach(([key, value]) => {
          if (value === undefined || value === null) return;
          // Normalize boolean -> string ("true"/"false")
          if (typeof value === "boolean") {
            formData.append(key, value ? "true" : "false");
          } else {
            formData.append(key, String(value));
          }
        });
      }

      if (ENABLE_UPLOAD_DEBUG) {
        console.log("[useReportMediaUpload] sending FormData:", {
          report_id: reportId,
          fileCount: files.length,
          extraFields,
        });
      }

      const res = await axiosInstance.post<ReportMediaUploadResponse>(
        "/report/upload-media", // confirm path!
        formData,
        {
          // DO NOT set Content-Type; Axios will set correct multipart boundary
          onUploadProgress: (evt) => {
            if (!evt.total) return;
            const pct = Math.round((evt.loaded * 100) / evt.total);
            setProgress(pct);
          },
        }
      );

      if (ENABLE_UPLOAD_DEBUG) {
        console.log(
          "[useReportMediaUpload] response:",
          res.status,
          res.data ?? "<no data>"
        );
      }

      if (!res.data) {
        throw new Error("Failed to upload report media");
      }
      return res.data;
    },

    onSuccess: (data, variables) => {
      // Invalidate caches for this report
      queryClient.invalidateQueries({
        queryKey: ["report", variables.reportId],
      });
      queryClient.invalidateQueries({
        queryKey: ["report", variables.reportId, "media"],
      });
      setProgress(0);
    },

    onError: (err) => {
      if (ENABLE_UPLOAD_DEBUG) {
        console.error("[useReportMediaUpload] upload error:", err);
      }
      setProgress(0);
    },
  });

  // Convenience: extract URL from latest success result
  const normalized: NormalizedUploadResult | null = React.useMemo(() => {
    const d = mutation.data;
    if (!d) return null;
    const url =
      d?.data?.url ?? d?.media?.[0]?.url ?? d?.url ?? null;
    return { success: !!d?.success, url, raw: d };
  }, [mutation.data]);

  return {
    ...mutation,
    progress, // 0-100
    normalized, // safe access to URL
  };
};

interface PublishReportPayload {
  report_id: string;
  title: string;
  description: string;
  categories: string[];
  fields_of_interest: string[];
  summarized_by: "ai" | "manual";
  content: string;
  thumbnail: string;
}

export function usePublishReport() {
  return useMutation({
    mutationFn: async (payload: PublishReportPayload) => {
      const res = await axiosInstance.post("/report", payload);
      return res.data;
    },
  });
}