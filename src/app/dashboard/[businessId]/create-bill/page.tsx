import { BillInterface } from "./_components/BillInterface";
import { BarcodeScanner } from "./_components/BarcodeScanner";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function CreateBillPage({
  params,
}: {
  params: { businesssId: string };
}) {
  const client = new QueryClient();
  return (
    <HydrationBoundary state={dehydrate(client)}>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Create Bill</h1>
        <BillInterface businessId={params.businesssId} />
        <BarcodeScanner businessId={params.businesssId} />
      </div>
    </HydrationBoundary>
  );
}
