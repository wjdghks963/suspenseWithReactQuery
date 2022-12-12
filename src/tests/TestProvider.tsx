import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

export default function TestProvider({ children }: any) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
