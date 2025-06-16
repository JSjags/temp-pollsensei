"use client";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ReceiptPDFDocument from "@/components/reusable/ReceiptPDFDocument";
import { GoDownload } from "react-icons/go";

interface PDFDownloadButtonProps {
  record: any;
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ record }) => (
  <PDFDownloadLink
    document={<ReceiptPDFDocument record={record} />}
    fileName={`PollSensei-Receipt-${record._id}.pdf`}
  >
    {({ loading }) => (
      <button
        className="flex items-center gap-2 px-4 py-1.5 bg-purple-600 text-white rounded-full shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm font-semibold transition-colors duration-150 disabled:opacity-60"
        disabled={loading}
        title="Download receipt as PDF"
        aria-label="Download receipt as PDF"
      >
        <GoDownload className="text-lg" />
        {loading ? "Generating..." : "Download"}
      </button>
    )}
  </PDFDownloadLink>
);

export default PDFDownloadButton;
