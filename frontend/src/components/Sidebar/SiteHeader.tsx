import { FaPlusCircle } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "../ui/sidebar";

export function SiteHeader() {
  return (
    <header className="bg-background/90 sticky top-0 z-10 flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear lg:px-6">
      <SidebarTrigger className="block md:hidden" />
      <div className="ml-auto flex items-center gap-2">
        <Button
          size="sm"
          className="flex h-7 items-center justify-center gap-1"
        >
          <FaPlusCircle />
          <span>Quick Create</span>
        </Button>
      </div>
    </header>
  );
}
