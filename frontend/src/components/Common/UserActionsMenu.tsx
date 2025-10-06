import { BsThreeDotsVertical } from "react-icons/bs";
import type { UserPublic } from "@/client";
import DeleteUser from "../Admin/DeleteUser";
import EditUser from "../Admin/EditUser";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

interface UserActionsMenuProps {
  user: UserPublic;
  disabled?: boolean;
}

export const UserActionsMenu = ({ user, disabled }: UserActionsMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={disabled}>
          <BsThreeDotsVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="space-y-2">
        <EditUser user={user} />
        <DeleteUser id={user.id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
