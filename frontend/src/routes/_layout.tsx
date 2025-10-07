import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import * as React from "react";

import { AppSidebar } from "@/components/Sidebar";
import { SiteHeader } from "@/components/Sidebar/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { isLoggedIn } from "@/hooks/useAuth";

export const Route = createFileRoute("/_layout")({
  component: Layout,
  beforeLoad: () => {
    if (!isLoggedIn()) {
      throw redirect({
        to: "/login",
      });
    }
  },
});

function Layout() {
  const MainContentWrapper = ({ children }: { children: React.ReactNode }) => (
    <main className="flex w-full flex-1 flex-col overflow-auto p-6">
      {children}
    </main>
  );

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 64)",
          "--header-height": "calc(var(--spacing) * 12 + 1px)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="sidebar" />
      <SidebarInset>
        <SiteHeader />
        <MainContentWrapper>
          <Outlet />
        </MainContentWrapper>
      </SidebarInset>
    </SidebarProvider>
  );
}
