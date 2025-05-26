import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import React from "react";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#f3f4f6", // light gray
    paddingVertical: 40,
    paddingHorizontal: 0,
    minHeight: "100vh",
  },
  receiptPaper: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: 340,
    minHeight: 500,
    padding: 24,
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    border: "1.5px dashed #d1d5db",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  logo: {
    width: 110,
    height: 24,
    marginBottom: 8,
  },
  brand: {
    fontSize: 10,
    color: "#5B03B2",
    marginBottom: 2,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  bigTitle: {
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 4,
    color: "#222",
    marginBottom: 8,
    textAlign: "center",
  },
  dottedLine: {
    borderBottom: "1.5px dotted #d1d5db",
    width: "100%",
    marginVertical: 12,
  },
  section: {
    width: "100%",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    color: "#888",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  value: {
    color: "#222",
    fontSize: 12,
    fontFamily: "Courier",
  },
  statusPaid: {
    color: "#22c55e",
    fontWeight: "bold",
    fontSize: 12,
  },
  statusFailed: {
    color: "#ef4444",
    fontWeight: "bold",
    fontSize: 12,
  },
  statusPending: {
    color: "#eab308",
    fontWeight: "bold",
    fontSize: 12,
  },
  thankYou: {
    marginTop: 18,
    fontSize: 13,
    color: "#5B03B2",
    textAlign: "center",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  barcode: {
    marginTop: 24,
    width: "100%",
    alignItems: "center",
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
  },
  receiptId: {
    fontSize: 9,
    color: "#aaa",
    marginTop: 6,
    textAlign: "center",
    letterSpacing: 1,
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
        <View style={styles.receiptPaper}>
          {/* Logo & Brand */}
          <Image src={"/assets/pollsensei-logo.png"} style={styles.logo} />
          {/* <Text style={styles.brand}>PollSensei.ai</Text> */}
          <Text style={styles.bigTitle}>RECEIPT</Text>
          <View style={styles.dottedLine} />
          {/* Details */}
          <View style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.label}>Plan</Text>
              <Text style={styles.value}>{record.plan_id?.name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Amount</Text>
              <Text style={styles.value}>
                {record.amount} {record.currency}
              </Text>
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
