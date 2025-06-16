"use client";
import React, { useState } from "react";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import InvoicePDFDocument from "@/components/reusable/InvoicePDFDocument";
import { getOrganizationInvoice } from "@/services/admin";
import { GoDownload } from "react-icons/go";

const InvoiceDownloadButton: React.FC = () => {
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getOrganizationInvoice();
      if (res) {
        const blob = await pdf(<InvoicePDFDocument invoice={res} />).toBlob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `PollSensei-Invoice-${res.invoice_id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to fetch invoice data.");
    } finally {
      setLoading(false);
    }
  };

  if (ready && invoice) {
    return (
      <PDFDownloadLink
        document={<InvoicePDFDocument invoice={invoice} />}
        fileName={`PollSensei-Invoice-${invoice.invoice_id}.pdf`}
      >
        {({ loading: pdfLoading }) => (
          <button
            className="flex items-center gap-1 auth-btn px-4 py-2 !h-10 rounded text-sm font-medium transition-colors"
            disabled={pdfLoading}
            title="Download invoice"
          >
            <GoDownload />
            {pdfLoading ? "Generating..." : "Download Invoice"}
          </button>
        )}
      </PDFDownloadLink>
    );
  }

  return (
    <div className="inline-block">
      <button
        onClick={handleDownload}
        className="flex items-center gap-1 px-4 py-2 auth-btn !h-10 text-sm font-medium transition-colors"
        disabled={loading}
        title="Generate invoice"
      >
        <GoDownload />
        {loading ? "Generating..." : "Generate Invoice"}
      </button>
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
    </div>
  );
};

export default InvoiceDownloadButton;
