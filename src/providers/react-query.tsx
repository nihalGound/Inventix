import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const client = new QueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

export default ReactQueryProvider;
