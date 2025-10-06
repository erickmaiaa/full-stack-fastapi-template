import { FaPlusCircle } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "../ui/sidebar";

export function SiteHeader() {
  return (
    <header className="bg-background/90 sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="md:hidden block" />
        <div className="ml-auto flex items-center gap-2">
          <Button
            size="sm"
            className="h-7 flex items-center justify-center gap-1"
          >
            <FaPlusCircle />
            <span>Quick Create</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
