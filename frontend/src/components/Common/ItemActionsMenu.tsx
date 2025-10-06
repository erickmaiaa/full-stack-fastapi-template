import { Button } from "../ui/button";
import { BsThreeDotsVertical } from "react-icons/bs";
import type { ItemPublic } from "@/client";
import DeleteItem from "../Items/DeleteItem";
import EditItem from "../Items/EditItem";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../ui/dropdown-menu";

interface ItemActionsMenuProps {
  item: ItemPublic;
}

export const ItemActionsMenu = ({ item }: ItemActionsMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <BsThreeDotsVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="space-y-2">
        <EditItem item={item} />
        <DeleteItem id={item.id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
