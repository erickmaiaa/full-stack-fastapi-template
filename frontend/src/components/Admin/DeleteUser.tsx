import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiTrash2 } from "react-icons/fi";

import { UsersService } from "@/client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useCustomToast from "@/hooks/useCustomToast";

const DeleteUser = ({ id }: { id: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const deleteUser = async (id: string) => {
    await UsersService.deleteUser({ userId: id });
  };

  const mutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      showSuccessToast("The user was deleted successfully");
      setIsOpen(false);
    },
    onError: () => {
      showErrorToast("An error occurred while deleting the user");
    },
    onSettled: () => {
      queryClient.invalidateQueries();
    },
  });

  const onSubmit = async () => {
    mutation.mutate(id);
  };

  const TriggerButton = (
    <Button
      variant="destructive"
      size="sm"
      className="flex items-center gap-2 px-3 py-2 rounded-md transition-colors hover:bg-red-600 focus:ring-2 focus:ring-red-400"
    >
      <FiTrash2 className="text-lg" />
      <span className="font-medium">Delete User</span>
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{TriggerButton}</DialogTrigger>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              All items associated with this user will also be{" "}
              <strong>permanently deleted.</strong> Are you sure? You will not
              be able to undo this action.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="space-x-2">
            <DialogClose asChild>
              <Button variant="ghost" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>

            <Button variant="destructive" type="submit" disabled={isSubmitting}>
              Delete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUser;
