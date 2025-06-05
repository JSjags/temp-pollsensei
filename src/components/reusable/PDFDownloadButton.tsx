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
        className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-600 rounded hover:bg-purple-100 border border-purple-200 text-xs font-medium transition-colors"
        disabled={loading}
        title="Download receipt"
      >
        <GoDownload />
        {loading ? "Generating..." : "Download"}
      </button>
    )}
  </PDFDownloadLink>
);

export default PDFDownloadButton;
