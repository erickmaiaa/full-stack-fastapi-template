import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import { z } from "zod";

import { type ItemCreate, ItemsService, type ApiError } from "@/client";
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

const itemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(5, "Description must be at least 5 characters."),
});

type ItemFormValues = z.infer<typeof itemSchema>;

interface AddItemContentProps {
  form: ReturnType<typeof useForm<ItemFormValues>>;
  onSubmit: SubmitHandler<ItemFormValues>;
  isSubmitting: boolean;
}

const AddItemContent = ({ form, onSubmit }: AddItemContentProps) => (
  <Form {...form}>
    <form id="add-item-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </form>
  </Form>
);

const AddItem = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const { showSuccessToast } = useCustomToast();

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const {
    reset,
    formState: { isSubmitting },
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

  const onSubmit: SubmitHandler<ItemFormValues> = (data) => {
    mutation.mutate(data);
  };

  const TriggerButton = (
    <Button className="my-4 flex items-center gap-2" size="sm">
      <FaPlus fontSize="16px" />
      Add Item
    </Button>
  );

  const commonProps = {
    form,
    onSubmit,
    isSubmitting,
  };

  if (!isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{TriggerButton}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Item</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new item.
            </DialogDescription>
          </DialogHeader>
          <AddItemContent {...commonProps} />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" form="add-item-form" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
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
          <DrawerDescription>
            Fill in the details to add a new item.
          </DrawerDescription>
        </DrawerHeader>
        <AddItemContent {...commonProps} />
        <DrawerFooter className="pt-2">
          <Button type="submit" form="add-item-form" disabled={isSubmitting}>
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
};

export default AddItem;
