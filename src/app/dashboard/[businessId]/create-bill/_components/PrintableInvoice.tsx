import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface PrintableInvoiceProps {
  billId: string;
  date: Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  products: Product[];
  discount: number;
  total: number;
  businessName: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 12,
    lineHeight: 1.6,
    color: "#333333",
    backgroundColor: "#f8f9fa",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  businessName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007bff",
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "right",
    color: "#333333",
  },
  metadata: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 6,
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
  },
  metadataField: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  fieldLabel: {
    fontWeight: "bold",
    color: "#555555",
  },
  fieldValue: {
    textAlign: "right",
    color: "#333333",
  },
  tableContainer: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 4,
  },
  tableHeaderText: {
    fontWeight: "bold",
    color: "#ffffff",
    fontSize: 12,
    flex: 1,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    color: "#333333",
  },
  totalsSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 6,
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalLabel: {
    fontWeight: "bold",
    color: "#555555",
  },
  totalValue: {
    textAlign: "right",
    fontWeight: "bold",
    color: "#333333",
  },
});

const InvoicePDF = ({
  customerName,
  customerEmail,
  customerPhone,
  products,
  discount,
  total,
  businessName,
  date,
  billId,
}: PrintableInvoiceProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.businessName}>{businessName}</Text>
        <Text style={styles.invoiceTitle}>Invoice</Text>
      </View>

      {/* Customer Details */}
      <View style={styles.metadata}>
        <View style={styles.metadataField}>
          <Text style={styles.fieldLabel}>Bill ID: {billId}</Text>
          <Text style={styles.fieldValue}>{date.toLocaleDateString()}</Text>
        </View>
        <View style={styles.metadataField}>
          <Text style={styles.fieldLabel}>Customer Name:</Text>
          <Text style={styles.fieldValue}>{customerName}</Text>
        </View>
        <View style={styles.metadataField}>
          <Text style={styles.fieldLabel}>Phone:</Text>
          <Text style={styles.fieldValue}>{customerPhone}</Text>
        </View>
        <View style={styles.metadataField}>
          <Text style={styles.fieldLabel}>Email:</Text>
          <Text style={styles.fieldValue}>{customerEmail}</Text>
        </View>
      </View>

      {/* Product Table */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Item</Text>
          <Text style={styles.tableHeaderText}>Qty</Text>
          <Text style={styles.tableHeaderText}>Price</Text>
          <Text style={styles.tableHeaderText}>Total</Text>
        </View>
        {products.map((product) => (
          <View key={product.id} style={styles.tableRow}>
            <Text style={styles.tableCell}>{product.name}</Text>
            <Text style={styles.tableCell}>{product.quantity}</Text>
            <Text style={styles.tableCell}>${product.price.toFixed(2)}</Text>
            <Text style={styles.tableCell}>
              ${(product.price * product.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={styles.totalsSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalValue}>
            ${(total + discount).toFixed(2)}
          </Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Discount:</Text>
          <Text style={styles.totalValue}>{discount.toFixed(2)}%</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export const DownloadableInvoice = (props: PrintableInvoiceProps) => (
  <div>
    <PDFDownloadLink
      document={<InvoicePDF {...props} />}
      fileName="invoice.pdf"
      className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
    >
      {({ loading }) => (loading ? "Generating PDF..." : "Download Invoice")}
    </PDFDownloadLink>
  </div>
);

export default InvoicePDF;
