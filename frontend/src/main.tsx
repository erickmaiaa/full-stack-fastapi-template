import "./index.css";

import ReactDOM from "react-dom/client";
import { StrictMode } from "react";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  createRouter,
  RouterProvider,
  createBrowserHistory,
} from "@tanstack/react-router";

import { ApiError, OpenAPI } from "./client";
import { routeTree } from "./routeTree.gen";
import { ThemeProvider } from "@/components/ui/theme";
import { Toaster } from "@/components/ui/sonner";

OpenAPI.BASE = import.meta.env.VITE_API_URL;
OpenAPI.TOKEN = async () => {
  return localStorage.getItem("access_token") || "";
};

const router = createRouter({
  routeTree,
  history: createBrowserHistory(),
});

const handleApiError = (error: Error) => {
  if (error instanceof ApiError && [401, 403].includes(error.status)) {
    localStorage.removeItem("access_token");
    router.navigate({ to: "/login" });
  }
};

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleApiError,
  }),
  mutationCache: new MutationCache({
    onError: handleApiError,
  }),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
);
