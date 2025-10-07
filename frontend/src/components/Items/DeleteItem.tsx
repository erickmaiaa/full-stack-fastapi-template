import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";

import { type ApiError, ItemsService } from "@/client";
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

const DeleteItem = ({ id }: { id: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const { showSuccessToast } = useCustomToast();

  const deleteItemMutation = useMutation({
    mutationFn: () => ItemsService.deleteItem({ id }),
    onSuccess: () => {
      showSuccessToast("The item was deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["items"] });
      setIsOpen(false);
    },
    onError: (err: ApiError) => {
      handleError(err);
    },
  });

  const TriggerButton = (
    <Button
      variant="destructive"
      size="sm"
      className="flex items-center gap-2 px-3 py-2 rounded-md transition-colors hover:bg-red-600 focus:ring-2 focus:ring-red-400"
    >
      <FiTrash2 className="text-lg" />
      <span className="font-medium">Delete Item</span>
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Delete Item</DrawerTitle>
            <DrawerDescription>
              This item will be permanently deleted. Are you sure? You will not
              be able to undo this action.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="pt-2">
            <Button
              variant="destructive"
              onClick={() => deleteItemMutation.mutate()}
              disabled={deleteItemMutation.isPending}
            >
              {deleteItemMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" disabled={deleteItemMutation.isPending}>
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
          <AlertDialogTitle>Delete Item</AlertDialogTitle>
          <AlertDialogDescription>
            This item will be permanently deleted. Are you sure? You will not be
            able to undo this action.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteItemMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteItemMutation.mutate()}
            disabled={deleteItemMutation.isPending}
          >
            {deleteItemMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteItem;
