import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { type ApiError, UsersService } from "@/client";
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
import useAuth from "@/hooks/useAuth";
import useCustomToast from "@/hooks/useCustomToast";
import { handleError } from "@/utils";

const DeleteConfirmation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { showSuccessToast } = useCustomToast();
  const { logout } = useAuth();

  const deleteUserMutation = useMutation({
    mutationFn: () => UsersService.deleteUserMe(),
    onSuccess: () => {
      showSuccessToast("Your account has been successfully deleted");
      setIsOpen(false);
      logout();
    },
    onError: (err: ApiError) => {
      handleError(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="mt-4">
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmation Required</DialogTitle>
        </DialogHeader>

        <DialogDescription asChild>
          <p className="text-sm text-muted-foreground mb-4">
            All your account data will be <strong>permanently deleted.</strong>{" "}
            If you are sure, please click <strong>&quot;Confirm&quot;</strong>{" "}
            to proceed. This action cannot be undone.
          </p>
        </DialogDescription>

        <DialogFooter className="flex gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={deleteUserMutation.isPending}>
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="button"
            variant="destructive"
            disabled={deleteUserMutation.isPending}
            onClick={() => deleteUserMutation.mutate()}
          >
            {deleteUserMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmation;
