import React from "react";
import ProductPage from "./_components/productPage";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

async function Product({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;
  const client = new QueryClient();
  return (
    <HydrationBoundary state={dehydrate(client)}>
      <ProductPage businessId={businessId} />;
    </HydrationBoundary>
  );
}

export default Product;
