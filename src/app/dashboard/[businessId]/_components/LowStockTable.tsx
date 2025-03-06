import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBusinessAnalytics } from "@/utils/queries";
import { useParams } from "next/navigation";

// const lowStocks = [
//   {
//     id: "asaskldfjadsflkjasf",
//     name: "Rice",
//     stock: 10,
//     lowStockThreshold: 25,
//   },
//   {
//     id: "asaskldfjadsflkjasd",
//     name: "Wheat",
//     stock: 10,
//     lowStockThreshold: 34,
//   },
// ];

const getStockStatus = (stock: number, threshold: number) => {
  if (stock === 0) return { label: "Out of Stock", color: "#ef4444" };
  if (stock <= threshold / 3) return { label: "Critical", color: "#dc2626" };
  if (stock <= threshold / 2) return { label: "Warning", color: "#eab308" };
  return { label: "Low Stock", color: "#f59e0b" };
};
export default function LowStockTable() {
  const params = useParams();
  const { data, isFetching } = useBusinessAnalytics(
    params.businessId as string
  );
  const { data: analytics, status } = data as {
    status: number;
    data: {
      totalSales: number;
      totalProducts: number;
      topProductByMonth: {
        month: string;
        products: {
          name: string;
          revenue: number;
        }[];
      }[];
      lowStock: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        image: string | null;
        businessId: string;
        price: number;
        stock: number;
        lowStockThreshold: number;
      }[];
    };
  };
  if (isFetching || status != 200) {
    return (
      <Card>
        <Skeleton className="w-full h-full" />
      </Card>
    );
  }
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption className="text-lg">Low Stock Alerts</TableCaption>
        <TableHeader>
          <TableRow className="border border-muted-foreground">
            <TableHead className="min-w-[120px]">Product</TableHead>
            <TableHead className="min-w-[100px]">Current</TableHead>
            <TableHead className="min-w-[100px]">Needed</TableHead>
            <TableHead className="text-right min-w-[100px]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {analytics.lowStock.slice(0, 1).map((item) => {
            const status = getStockStatus(item.stock, item.lowStockThreshold);
            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.stock}</TableCell>
                <TableCell>{item.lowStockThreshold - item.stock}</TableCell>
                <TableCell className="text-right">
                  <div
                    className="px-2 py-1 rounded-lg inline-block"
                    style={{ backgroundColor: `${status.color}33` }}
                  >
                    <span
                      className="text-sm md:text-base"
                      style={{ color: status.color }}
                    >
                      {status.label}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
