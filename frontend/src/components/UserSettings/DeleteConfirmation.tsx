import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";

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
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  const { logout } = useAuth();

  const mutation = useMutation({
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

  const onSubmit = async () => {
    mutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="mt-4">
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Confirmation Required</DialogTitle>
          </DialogHeader>

          <DialogDescription asChild>
            <p className="text-sm text-muted-foreground mb-4">
              All your account data will be{" "}
              <strong>permanently deleted.</strong> If you are sure, please
              click <strong>&quot;Confirm&quot;</strong> to proceed. This action
              cannot be undone.
            </p>
          </DialogDescription>

          <DialogFooter className="flex gap-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" variant="destructive" disabled={isSubmitting}>
              Delete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmation;
