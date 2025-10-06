import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  type SubmitHandler,
  useForm,
  type UseFormReturn,
} from "react-hook-form";
import { FaExchangeAlt } from "react-icons/fa";

import { type ApiError, type ItemPublic, ItemsService } from "@/client";
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

interface EditItemProps {
  item: ItemPublic;
}

interface ItemUpdateFormValues {
  title: string;
  description?: string;
}

interface EditItemFormProps {
  form: UseFormReturn<ItemUpdateFormValues>;
  onSubmit: SubmitHandler<ItemUpdateFormValues>;
}

const EditItemForm = ({ form, onSubmit }: EditItemFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form
      id={`edit-item-form-${form.getValues("title")}`}
      onSubmit={handleSubmit(onSubmit)}
    >
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
            placeholder="Title"
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
            {...register("description")}
            placeholder="Description"
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

const EditItem = ({ item }: EditItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useIsMobile();
  const queryClient = useQueryClient();
  const { showSuccessToast } = useCustomToast();

  const form = useForm<ItemUpdateFormValues>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      title: item.title,
      description: item.description ?? "",
    },
  });

  const {
    reset,
    formState: { isSubmitting, isValid },
  } = form;

  const mutation = useMutation({
    mutationFn: (data: ItemUpdateFormValues) =>
      ItemsService.updateItem({ id: item.id, requestBody: data }),
    onSuccess: () => {
      showSuccessToast("Item updated successfully.");
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

  const onSubmit: SubmitHandler<ItemUpdateFormValues> = (data) => {
    mutation.mutate(data);
  };

  const TriggerButton = (
    <Button
      className="flex items-center w-full gap-2 px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
      variant="outline"
    >
      <FaExchangeAlt fontSize="16px" className="mr-1" />
      <span className="font-medium">Edit Item</span>
    </Button>
  );

  if (!isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{TriggerButton}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground -mt-2">
            Update the item details below.
          </p>
          <EditItemForm form={form} onSubmit={onSubmit} />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              form={`edit-item-form-${item.id}`}
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
          <DrawerTitle>Edit Item</DrawerTitle>
          <p className="text-sm text-muted-foreground">
            Update the item details below.
          </p>
        </DrawerHeader>
        <EditItemForm form={form} onSubmit={onSubmit} />
        <DrawerFooter className="pt-2">
          <Button
            type="submit"
            form={`edit-item-form-${item.id}`}
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

export default EditItem;
