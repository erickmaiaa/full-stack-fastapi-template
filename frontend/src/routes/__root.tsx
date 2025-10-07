import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

import NotFound from "@/components/Common/NotFound";

const loadDevtools = () =>
  Promise.all([
    import("@tanstack/router-devtools"),
    import("@tanstack/react-query-devtools"),
  ]).then(([routerDevtools, reactQueryDevtools]) => ({
    default: () => (
      <>
        <routerDevtools.TanStackRouterDevtools />
        <reactQueryDevtools.ReactQueryDevtools />
      </>
    ),
  }));

const TanStackDevtools =
  process.env.NODE_ENV === "production" ? () => null : lazy(loadDevtools);

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Suspense>
        <TanStackDevtools />
      </Suspense>
    </>
  ),
  notFoundComponent: () => <NotFound />,
});
