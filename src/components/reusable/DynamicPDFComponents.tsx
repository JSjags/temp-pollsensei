import dynamic from "next/dynamic";

export const DynamicDownloadPdfButton = dynamic(
  () => import("./DownloadPdfButton"),
  { ssr: false }
);

export const DynamicSurveyPDFDocument = dynamic(
  () => import("./SurveyPDFDocument"),
  { ssr: false }
);

export const DynamicDownloadPDF = dynamic(
  () =>
    import("../survey/share/DownloadPDF").then((mod) => ({
      default: mod.DownloadPDF,
    })),
  { ssr: false }
);
