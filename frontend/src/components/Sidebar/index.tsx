"use client";

import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  MdCameraAlt,
  MdDashboard,
  MdStorage,
  MdDescription,
  MdTextFields,
  MdHelpOutline,
  MdList,
  MdAssessment,
  MdSearch,
  MdSettings,
  MdPeople,
  MdBlurOn,
  MdLightbulbOutline,
} from "react-icons/md";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
/* import { NavDocuments } from "@/components/Sidebar/NavDocuments"; */
import { NavMain } from "@/components/Sidebar/NavMain";
import { NavSecondary } from "@/components/Sidebar/NavSecondary";
import { NavUser } from "@/components/Sidebar/NavUser";
import useAuth from "@/hooks/useAuth";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: MdDashboard,
    },
    {
      title: "Items",
      url: "/items",
      icon: MdList,
    },
    {
      title: "Admin",
      url: "/admin",
      icon: MdPeople,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: MdCameraAlt,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: MdDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: MdLightbulbOutline,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: MdSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: MdHelpOutline,
    },
    {
      title: "Search",
      url: "#",
      icon: MdSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: MdStorage,
    },
    {
      name: "Reports",
      url: "#",
      icon: MdAssessment,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: MdTextFields,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  return (
    <Sidebar className="border-r" {...props}>
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/">
                <MdBlurOn className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
