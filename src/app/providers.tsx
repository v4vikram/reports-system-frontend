"use client";

import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionBootstrap } from "@/features/auth";
import { ApiClientError } from "@/lib/api-client";

function getErrorMessage(error: unknown) {
  return error instanceof ApiClientError ? error.message : "Something went wrong";
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
        // Mutations are explicit user actions (submit, delete, ...) so a
        // failure always deserves feedback. Queries (e.g. the background
        // /auth/me check on every page) fail silently here on purpose —
        // an anonymous visitor loading any page shouldn't see an error
        // toast just because they're not logged in.
        mutationCache: new MutationCache({
          onError: (error) => toast.error(getErrorMessage(error)),
        }),
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <TooltipProvider>
          <SessionBootstrap />
          {children}
        </TooltipProvider>
        <Toaster richColors closeButton />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
