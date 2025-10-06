import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import * as React from "react";

import { isLoggedIn } from "@/hooks/useAuth";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/Sidebar/SiteHeader";
import { AppSidebar } from "@/components/Sidebar";

export const Route = createFileRoute("/_layout")({
  component: Layout,
  beforeLoad: async () => {
    if (!isLoggedIn()) {
      throw redirect({
        to: "/login",
      });
    }
  },
});

function MainContentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex w-full flex-1 flex-col overflow-auto p-6">
      {children}
    </main>
  );
}

function Layout() {
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
