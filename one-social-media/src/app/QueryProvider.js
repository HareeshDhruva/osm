"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SnackbarProvider } from "notistack";
const queryClient = new QueryClient();
const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider maxSnack={1}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </SnackbarProvider>
    </QueryClientProvider>
  );
};

export default QueryProvider;
