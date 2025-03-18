import { BillInterface } from "./_components/BillInterface";
import { BarcodeScanner } from "./_components/BarcodeScanner";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { getBusinessDetail } from "@/actions/business";

export default async function CreateBillPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;
  const client = new QueryClient();
  await client.prefetchQuery({
    queryKey: queryKeys.getBusinessDetail(businessId),
    queryFn: () => getBusinessDetail(businessId),
  });
  return (
    <HydrationBoundary state={dehydrate(client)}>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold mb-6">Create Bill</h1>
        </div>
        <BillInterface businessId={businessId} />
        <BarcodeScanner businessId={businessId} />
      </div>
    </HydrationBoundary>
  );
}
