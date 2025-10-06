import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  type SubmitHandler,
  useForm,
  type UseFormReturn,
} from "react-hook-form";
import { FaPlus } from "react-icons/fa";

import { type ItemCreate, ItemsService } from "@/client";
import type { ApiError } from "@/client/core/ApiError";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useCustomToast from "@/hooks/useCustomToast";
import { useIsMobile } from "@/hooks/useMobile";
import { handleError } from "@/utils";

import { Field } from "../ui/field";

interface AddItemFormProps {
  form: UseFormReturn<ItemCreate>;
  onSubmit: SubmitHandler<ItemCreate>;
}

const AddItemForm = ({ form, onSubmit }: AddItemFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form id="add-item-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4 p-4 sm:p-0">
        <Field>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            {...register("title", {
              required: "Title is required.",
              minLength: {
                value: 3,
                message: "Title must be at least 3 characters.",
              },
            })}
            type="text"
            autoComplete="off"
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </Field>

        <Field>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            {...register("description", {
              required: "Description is required.",
              minLength: {
                value: 5,
                message: "Description must be at least 5 characters.",
              },
            })}
            type="text"
            autoComplete="off"
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </Field>
      </div>
    </form>
  );
};

const AddItem = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useIsMobile();
  const queryClient = useQueryClient();
  const { showSuccessToast } = useCustomToast();
  const form = useForm<ItemCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      title: "",
      description: "",
    },
  });
  const {
    reset,
    formState: { isValid, isSubmitting },
  } = form;

  const mutation = useMutation({
    mutationFn: (data: ItemCreate) =>
      ItemsService.createItem({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast("Item created successfully.");
      reset();
      setIsOpen(false);
    },
    onError: (err: ApiError) => {
      handleError(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  const onSubmit: SubmitHandler<ItemCreate> = (data) => {
    mutation.mutate(data);
  };

  const TriggerButton = (
    <Button className="my-4 flex items-center gap-2" size="sm">
      <FaPlus fontSize="16px" />
      Add Item
    </Button>
  );

  if (!isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{TriggerButton}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Item</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground -mt-2">
            Fill in the details to add a new item.
          </p>
          <AddItemForm form={form} onSubmit={onSubmit} />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              form="add-item-form"
              disabled={!isValid || isSubmitting}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add Item</DrawerTitle>
          <p className="text-sm text-muted-foreground">
            Fill in the details to add a new item.
          </p>
        </DrawerHeader>
        <AddItemForm form={form} onSubmit={onSubmit} />
        <DrawerFooter className="pt-2">
          <Button
            type="submit"
            form="add-item-form"
            disabled={!isValid || isSubmitting}
          >
            Save
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddItem;
