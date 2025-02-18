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
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  products: Product[];
  discount: number;
  total: number;
  businessName: string;
  printMode?: boolean; // Add this to handle print-specific styling
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.6,
    color: "#2D3748",
  },
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection:"row"
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#1A202C",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  subheader: {
    marginBottom:"10px",
    fontSize: 18,
    color: "#1A202C",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  section: {
    marginBottom: 20,
  },
  field: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontWeight: "medium",
    color: "#718096",
  },
  value: {
    textAlign: "right",
    color: "#2D3748",
  },
  tableContainer: {
    marginVertical: 30,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F7FAFC",
    padding: 12,
    marginBottom: 10,
    borderRadius: 4,
  },
  tableHeaderText: {
    fontWeight: "bold",
    color: "#4A5568",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
  },
  tableCell: {
    flex: 1,
    textAlign: "right",
    fontSize: 11,
  },
  tableCellLeft: {
    flex: 2,
    textAlign: "left",
  },
  divider: {
    marginVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
  },
  totalsSection: {
    marginLeft: "auto",
    width: "40%",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  finalTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: "#2D3748",
  },
  finalTotalText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1A202C",
  },
  metadata: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: "#F7FAFC",
    borderRadius: 4,
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
}: PrintableInvoiceProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <Text style={styles.header}>{businessName}</Text>
        <Text style={styles.subheader}>Invoice</Text>
      </View>

      {/* Customer Details */}
      <View style={styles.metadata}>
        <View style={styles.field}>
          <Text style={styles.label}>BILLED TO</Text>
          <Text style={styles.value}>{new Date().toLocaleDateString()}</Text>
        </View>
        <View style={[styles.field, { marginTop: 10 }]}>
          <View>
            <Text
              style={[styles.value, { fontWeight: "bold", textAlign: "left" }]}
            >
              {customerName}
            </Text>
            <Text
              style={[styles.value, { textAlign: "left", color: "#718096" }]}
            >
              Contact : {customerPhone}
            </Text>
            <Text
              style={[styles.value, { textAlign: "left", color: "#718096" }]}
            >
              Email: {customerEmail}
            </Text>
          </View>
        </View>
      </View>

      {/* Product Table */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text
            style={[
              styles.tableCell,
              styles.tableCellLeft,
              styles.tableHeaderText,
            ]}
          >
            Item Description
          </Text>
          <Text style={[styles.tableCell, styles.tableHeaderText]}>Qty</Text>
          <Text style={[styles.tableCell, styles.tableHeaderText]}>Price</Text>
          <Text style={[styles.tableCell, styles.tableHeaderText]}>Amount</Text>
        </View>

        {products.map((product) => (
          <View key={product.id} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellLeft]}>
              {product.name}
            </Text>
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
          <Text style={styles.label}>Subtotal</Text>
          <Text style={styles.value}>${(total + discount).toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.label}>Discount</Text>
          <Text style={styles.value}>{discount.toFixed(2)}%</Text>
        </View>
        <View style={styles.finalTotal}>
          <Text style={styles.finalTotalText}>Total</Text>
          <Text style={styles.finalTotalText}>${total.toFixed(2)}</Text>
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
