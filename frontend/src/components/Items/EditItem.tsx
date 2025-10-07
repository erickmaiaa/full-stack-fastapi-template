import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  type SubmitHandler,
  useForm,
  type UseFormReturn,
} from "react-hook-form";
import { FaExchangeAlt } from "react-icons/fa";
import { z } from "zod";

import {
  type ApiError,
  type ItemPublic,
  type ItemUpdate,
  ItemsService,
} from "@/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useCustomToast from "@/hooks/useCustomToast";
import { useIsMobile } from "@/hooks/useMobile";
import { handleError } from "@/utils";

const itemUpdateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().optional(),
});

type ItemUpdateFormValues = z.infer<typeof itemUpdateSchema>;

interface EditItemProps {
  item: ItemPublic;
}

interface EditItemFormProps {
  form: UseFormReturn<ItemUpdateFormValues>;
  onSubmit: SubmitHandler<ItemUpdateFormValues>;
}

const EditItemForm = ({ form, onSubmit }: EditItemFormProps) => {
  return (
    <Form {...form}>
      <form id="edit-item-form" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 p-4 sm:p-0">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

const EditItem = ({ item }: EditItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const { showSuccessToast } = useCustomToast();

  const form = useForm<ItemUpdateFormValues>({
    resolver: zodResolver(itemUpdateSchema),
    mode: "onBlur",
    defaultValues: {
      title: item.title,
      description: item.description ?? "",
    },
  });

  const {
    reset,
    formState: { isSubmitting },
  } = form;

  const mutation = useMutation({
    mutationFn: (data: ItemUpdate) =>
      ItemsService.updateItem({ id: item.id, requestBody: data }),
    onSuccess: () => {
      showSuccessToast("Item updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["items"] });
      reset();
      setIsOpen(false);
    },
    onError: (err: ApiError) => {
      handleError(err);
    },
  });

  const onSubmit: SubmitHandler<ItemUpdateFormValues> = (data) => {
    mutation.mutate(data);
  };

  const TriggerButton = (
    <Button
      className="flex items-center w-full gap-2 px-4 py-2 rounded-md"
      variant="outline"
    >
      <FaExchangeAlt fontSize="16px" className="mr-1" />
      <span className="font-medium">Edit Item</span>
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Edit Item</DrawerTitle>
            <DrawerDescription>
              Update the item details below.
            </DrawerDescription>
          </DrawerHeader>
          <EditItemForm form={form} onSubmit={onSubmit} />
          <DrawerFooter className="pt-2">
            <Button type="submit" form="edit-item-form" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
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
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{TriggerButton}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>Update the item details below.</DialogDescription>
        </DialogHeader>
        <EditItemForm form={form} onSubmit={onSubmit} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form="edit-item-form" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditItem;
