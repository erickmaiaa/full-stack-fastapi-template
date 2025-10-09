import {
  MdAssessment,
  MdCameraAlt,
  MdDashboard,
  MdDescription,
  MdHelpOutline,
  MdLightbulbOutline,
  MdList,
  MdSearch,
  MdSettings,
  MdStorage,
  MdTextFields,
} from "react-icons/md";

export const sidebarData = {
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
