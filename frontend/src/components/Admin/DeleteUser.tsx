import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";

import { type ApiError, UsersService } from "@/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import useCustomToast from "@/hooks/useCustomToast";
import { useIsMobile } from "@/hooks/useMobile";
import { handleError } from "@/utils";

const DeleteUser = ({ id }: { id: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const { showSuccessToast } = useCustomToast();

  const deleteUserMutation = useMutation({
    mutationFn: () => UsersService.deleteUser({ userId: id }),
    onSuccess: () => {
      showSuccessToast("The user was deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsOpen(false);
    },
    onError: (err: ApiError) => {
      handleError(err);
    },
  });

  const TriggerButton = (
    <Button
      variant="destructive"
      className="flex items-center w-full gap-2 px-4 py-2 rounded-md"
    >
      <FiTrash2 className="text-lg" />
      <span className="font-medium">Delete User</span>
    </Button>
  );

  const dialogDescription =
    "All items associated with this user will also be permanently deleted. Are you sure? You will not be able to undo this action.";

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Delete User</DrawerTitle>
            <DrawerDescription>{dialogDescription}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="pt-2">
            <Button
              variant="destructive"
              onClick={() => deleteUserMutation.mutate()}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" disabled={deleteUserMutation.isPending}>
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{TriggerButton}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User</AlertDialogTitle>
          <AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteUserMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteUserMutation.mutate()}
            disabled={deleteUserMutation.isPending}
          >
            {deleteUserMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUser;
