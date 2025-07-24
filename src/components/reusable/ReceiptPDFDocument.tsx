import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import React from "react";

// Register the local font just like InvoicePDFDocument
Font.register({
  family: "Helvetica-custom",
  src: "/fonts/DMSans-Variable.ttf",
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#f3f4f6", // light gray
    paddingVertical: 40,
    paddingHorizontal: 0,
    minHeight: "100vh",
    position: "relative",
    fontFamily: "Helvetica-custom",
  },
  watermark: {
    position: "absolute",
    top: 180,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#e9d5ff",
    fontSize: 60,
    fontWeight: 700,
    opacity: 0.12,
    transform: "rotate(-20deg)",
    zIndex: 0,
    fontFamily: "Helvetica-custom",
  },
  receiptPaper: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: 370,
    minHeight: 540,
    padding: 28,
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    border: "1.5px dashed #d1d5db",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    zIndex: 1,
    fontFamily: "Helvetica-custom",
  },
  accentBar: {
    width: "100%",
    height: 8,
    borderRadius: 8,
    background: "linear-gradient(90deg, #a78bfa 0%, #5B03B2 100%)",
    marginBottom: 16,
    fontFamily: "Helvetica-custom",
  },
  logo: {
    width: 110,
    height: 24,
    marginBottom: 8,
    fontFamily: "Helvetica-custom",
  },
  brand: {
    fontSize: 10,
    color: "#5B03B2",
    marginBottom: 2,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "bold",
    fontFamily: "Helvetica-custom",
  },
  bigTitle: {
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: 4,
    color: "#5B03B2",
    marginBottom: 8,
    textAlign: "center",
    fontFamily: "Helvetica-custom",
  },
  dottedLine: {
    borderBottom: "1.5px dotted #d1d5db",
    width: "100%",
    marginVertical: 14,
    fontFamily: "Helvetica-custom",
  },
  section: {
    width: "100%",
    marginBottom: 12,
    fontFamily: "Helvetica-custom",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
    fontFamily: "Helvetica-custom",
  },
  label: {
    color: "#888",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1,
    fontFamily: "Helvetica-custom",
  },
  value: {
    color: "#222",
    fontSize: 12,
    fontFamily: "Helvetica-custom",
  },
  summaryBox: {
    backgroundColor: "#f3e8ff",
    border: "1.5px solid #a78bfa",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 0,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
    display: "flex",
    fontFamily: "Helvetica-custom",
  },
  summaryLabel: {
    fontSize: 11,
    color: "#5B03B2",
    fontWeight: 700,
    letterSpacing: 1,
    fontFamily: "Helvetica-custom",
  },
  summaryAmount: {
    fontSize: 22,
    color: "#5B03B2",
    fontWeight: 700,
    fontFamily: "Helvetica-custom",
    marginTop: 2,
  },
  statusPaid: {
    color: "#22c55e",
    fontWeight: 700,
    fontSize: 12,
    fontFamily: "Helvetica-custom",
  },
  statusFailed: {
    color: "#ef4444",
    fontWeight: 700,
    fontSize: 12,
    fontFamily: "Helvetica-custom",
  },
  statusPending: {
    color: "#eab308",
    fontWeight: 700,
    fontSize: 12,
    fontFamily: "Helvetica-custom",
  },
  thankYou: {
    marginTop: 18,
    fontSize: 13,
    color: "#5B03B2",
    textAlign: "center",
    fontWeight: 700,
    letterSpacing: 1,
    fontFamily: "Helvetica-custom",
  },
  barcode: {
    marginTop: 24,
    width: "100%",
    alignItems: "center",
    fontFamily: "Helvetica-custom",
  },
  barcodeText: {
    fontFamily: "Courier",
    fontSize: 18,
    letterSpacing: 6,
    color: "#222",
    textAlign: "center",
  },
  footer: {
    marginTop: 16,
    fontSize: 9,
    color: "#888",
    textAlign: "center",
    width: "100%",
    fontFamily: "Helvetica-custom",
  },
  receiptId: {
    fontSize: 9,
    color: "#aaa",
    marginTop: 6,
    textAlign: "center",
    letterSpacing: 1,
    fontFamily: "Courier",
  },
});

interface ReceiptPDFDocumentProps {
  record: {
    _id: string;
    plan_id: { name: string };
    amount: number;
    currency: string;
    status: string;
    gateway: string;
    createdAt: string;
  };
}

const getStatusStyle = (status: string) => {
  const s = status.toLowerCase();
  if (s === "active" || s === "success" || s === "paid")
    return styles.statusPaid;
  if (s === "failed" || s === "cancelled") return styles.statusFailed;
  if (s === "pending") return styles.statusPending;
  return styles.value;
};

const fakeBarcode = (id: string) => {
  // Just a fun fake barcode using the id
  return id
    .slice(-12)
    .replace(/[^A-Za-z0-9]/g, "")
    .toUpperCase();
};

const ReceiptPDFDocument: React.FC<ReceiptPDFDocumentProps> = ({ record }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <Text style={styles.watermark}>PollSensei</Text>
        <View style={styles.receiptPaper}>
          {/* Accent Bar */}
          <View style={styles.accentBar} />
          {/* Logo & Brand */}
          <Image src={"/assets/pollsensei-logo.png"} style={styles.logo} />
          <Text style={styles.brand}>PollSensei.ai</Text>
          <Text style={styles.bigTitle}>RECEIPT</Text>
          <View style={styles.dottedLine} />
          {/* Amount Summary Box */}
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Total Paid</Text>
            <Text style={styles.summaryAmount}>
              {record.amount} {record.currency}
            </Text>
          </View>
          {/* Details */}
          <View style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.label}>Plan</Text>
              <Text style={styles.value}>{record.plan_id?.name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Status</Text>
              <Text style={getStatusStyle(record.status)}>{record.status}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Gateway</Text>
              <Text style={styles.value}>{record.gateway}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>
                {new Date(record.createdAt).toLocaleString()}
              </Text>
            </View>
          </View>
          <View style={styles.dottedLine} />
          <Text style={styles.thankYou}>
            Thank you for choosing PollSensei.ai!
          </Text>
          <Text style={styles.receiptId}>Receipt ID: {record._id}</Text>
          {/* Barcode */}
          <View style={styles.barcode}>
            <Text style={styles.barcodeText}>{fakeBarcode(record._id)}</Text>
          </View>
          <Text style={styles.footer}>
            Need help? support@pollsensei.ai | www.pollsensei.ai
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ReceiptPDFDocument;
