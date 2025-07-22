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

Font.register({
  family: "Helvetica-custom",
  src: "/fonts/DMSans-Variable.ttf",
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    paddingVertical: 40,
    paddingHorizontal: 0,
    minHeight: "100vh",
    fontFamily: "Helvetica-custom",
  },
  invoicePaper: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: 500,
    minHeight: 700,
    padding: 32,
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    border: "1.5px solid #d1d5db",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "Helvetica-custom",
  },
  logo: {
    width: 120,
    height: 28,
    marginBottom: 10,
    fontFamily: "Helvetica-custom",
  },
  brand: {
    fontSize: 12,
    color: "#5B03B2",
    marginBottom: 2,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "bold",
    fontFamily: "Helvetica-custom",
  },
  bigTitle: {
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 4,
    color: "#222",
    marginBottom: 8,
    textAlign: "center",
    fontFamily: "Helvetica-custom",
  },
  dottedLine: {
    borderBottom: "1.5px dotted #d1d5db",
    width: "100%",
    marginVertical: 16,
    fontFamily: "Helvetica-custom",
  },
  section: {
    width: "100%",
    marginBottom: 14,
    fontFamily: "Helvetica-custom",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    fontFamily: "Helvetica-custom",
  },
  label: {
    color: "#888",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
    fontFamily: "Helvetica-custom",
  },
  value: {
    color: "#222",
    fontSize: 13,
    fontFamily: "Helvetica-custom",
  },
  invoiceId: {
    fontSize: 10,
    color: "#aaa",
    marginTop: 6,
    textAlign: "center",
    letterSpacing: 1,
    fontFamily: "Helvetica-custom",
  },
  statusPaid: {
    color: "#22c55e",
    fontWeight: "bold",
    fontSize: 13,
    fontFamily: "Helvetica-custom",
  },
  statusPending: {
    color: "#eab308",
    fontWeight: "bold",
    fontSize: 13,
    fontFamily: "Helvetica-custom",
  },
  statusFailed: {
    color: "#ef4444",
    fontWeight: "bold",
    fontSize: 13,
    fontFamily: "Helvetica-custom",
  },
  table: {
    width: "100%",
    marginTop: 16,
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    overflow: "hidden",
    fontFamily: "Helvetica-custom",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderBottom: "1px solid #e5e7eb",
    fontFamily: "Helvetica-custom",
  },
  tableCellHeader: {
    flex: 1,
    padding: 8,
    fontWeight: "bold",
    fontSize: 12,
    color: "#5B03B2",
    fontFamily: "Helvetica-custom",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #e5e7eb",
    fontFamily: "Helvetica-custom",
  },
  tableCell: {
    flex: 1,
    padding: 8,
    fontSize: 12,
    color: "#222",
    fontFamily: "Helvetica-custom",
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  totalsLabel: {
    fontSize: 12,
    color: "#888",
    fontWeight: "bold",
    marginRight: 12,
  },
  totalsValue: {
    fontSize: 13,
    color: "#222",
    fontWeight: "bold",
    minWidth: 80,
    textAlign: "right",
  },
  note: {
    marginTop: 18,
    fontSize: 12,
    color: "#5B03B2",
    textAlign: "center",
    fontWeight: "bold",
    letterSpacing: 1,
    fontFamily: "Helvetica-custom",
  },
  footer: {
    marginTop: 24,
    fontSize: 10,
    color: "#888",
    textAlign: "center",
    width: "100%",
    fontFamily: "Helvetica-custom",
  },
  addressBlock: {
    marginTop: 10,
    marginBottom: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    fontFamily: "Helvetica-custom",
  },
  addressSection: {
    width: "48%",
    fontFamily: "Helvetica-custom",
  },
  addressTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#5B03B2",
    marginBottom: 2,
    fontFamily: "Helvetica-custom",
  },
  addressText: {
    fontSize: 11,
    color: "#222",
    marginBottom: 2,
    fontFamily: "Helvetica-custom",
  },
  paymentSummaryBlock: {
    width: "100%",
    marginTop: 24,
    marginBottom: 8,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 16,
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    fontFamily: "Helvetica-custom",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: "1px solid #e5e7eb",
    fontFamily: "Helvetica-custom",
  },
  summaryLabel: {
    fontSize: 13,
    color: "#444",
    fontWeight: "bold",
    fontFamily: "Helvetica-custom",
  },
  summaryValue: {
    fontSize: 13,
    color: "#222",
    fontWeight: "bold",
    fontFamily: "Helvetica-custom",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 8,
    borderTop: "2px solid #5B03B2",
    fontFamily: "Helvetica-custom",
  },
  totalLabel: {
    fontSize: 15,
    color: "#5B03B2",
    fontWeight: "bold",
    letterSpacing: 1,
    fontFamily: "Helvetica-custom",
  },
  totalValue: {
    fontSize: 15,
    color: "#5B03B2",
    fontWeight: "bold",
    fontFamily: "Helvetica-custom",
  },
});

interface InvoicePDFDocumentProps {
  invoice: any;
}

const getStatusStyle = (status: string) => {
  const s = status?.toLowerCase();
  if (s === "paid" || s === "success") return styles.statusPaid;
  if (s === "pending") return styles.statusPending;
  if (s === "failed" || s === "cancelled") return styles.statusFailed;
  return styles.value;
};

const InvoicePDFDocument: React.FC<InvoicePDFDocumentProps> = ({ invoice }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.invoicePaper}>
          {/* Logo & Brand */}
          <Image src={"/assets/pollsensei-logo.png"} style={styles.logo} />
          <Text style={styles.bigTitle}>INVOICE</Text>
          <View style={styles.dottedLine} />
          {/* Invoice Info */}
          <View style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.label}>Invoice ID:</Text>
              <Text style={styles.value}>{invoice.invoice_id}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Invoice Date:</Text>
              <Text style={styles.value}>{invoice.invoice_date}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Due Date:</Text>
              <Text style={styles.value}>
                {new Date(invoice.due_date).toLocaleString()}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Status:</Text>
              <Text style={getStatusStyle(invoice.payment_status)}>
                {invoice.payment_status}
              </Text>
            </View>
          </View>
          {/* Address Block */}
          <View style={styles.addressBlock}>
            <View style={styles.addressSection}>
              <Text style={styles.addressTitle}>Billed To</Text>
              <Text style={styles.addressText}>{invoice.name}</Text>
              <Text style={styles.addressText}>{invoice.email}</Text>
              <Text style={styles.addressText}>{invoice.address}</Text>
              <Text style={styles.addressText}>{invoice.phone}</Text>
            </View>
            <View style={styles.addressSection}>
              <Text style={styles.addressTitle}>From</Text>
              <Text style={styles.addressText}>{invoice.business_name}</Text>
              <Text style={styles.addressText}>Tax ID: {invoice.tax_id}</Text>
            </View>
          </View>
          <View style={styles.dottedLine} />
          {/* Table */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableCellHeader}>Description</Text>
              <Text style={styles.tableCellHeader}>Period</Text>
              <Text style={styles.tableCellHeader}>Qty</Text>
              <Text style={styles.tableCellHeader}>Unit Price</Text>
              <Text style={styles.tableCellHeader}>Total</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{invoice.plan_name}</Text>
              <Text style={styles.tableCell}>
                {invoice.subscription_period}
              </Text>
              <Text style={styles.tableCell}>{invoice.quantity}</Text>
              <Text style={styles.tableCell}>
                {invoice.unit_price.toLocaleString()} {invoice.currency}
              </Text>
              <Text style={styles.tableCell}>
                {invoice.sub_total.toLocaleString()} {invoice.currency}
              </Text>
            </View>
          </View>
          {/* Payment Summary */}
          <View style={styles.paymentSummaryBlock}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                {invoice.sub_total.toLocaleString()} {invoice.currency}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>
                {invoice.tax_amount.toLocaleString()} {invoice.currency}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={styles.summaryValue}>
                -{invoice.discount_amount.toLocaleString()} {invoice.currency}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                {invoice.total_amount.toLocaleString()} {invoice.currency}
              </Text>
            </View>
          </View>
          {/* Payment Details */}
          <View style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.label}>Payment Method</Text>
              <Text style={styles.value}>{invoice.payment_method}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Transaction ID</Text>
              <Text style={styles.value}>{invoice.transaction_id}</Text>
            </View>
          </View>
          <Text style={styles.note}>{invoice.invoice_note}</Text>
          <Text style={styles.invoiceId}>Invoice ID: {invoice.invoice_id}</Text>
          <View style={styles.footer}>
            <Text>Thank you for your business!</Text>
            <Text>PollSensei.ai</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDFDocument;
