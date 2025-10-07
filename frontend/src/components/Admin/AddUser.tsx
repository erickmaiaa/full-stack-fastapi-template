import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  type SubmitHandler,
  useForm,
  type UseFormReturn,
} from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import { z } from "zod";

import { type ApiError, type UserCreate, UsersService } from "@/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

const addUserSchema = z
  .object({
    email: z.string().email("Invalid email address."),
    full_name: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirm_password: z.string(),
    is_superuser: z.boolean(),
    is_active: z.boolean(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });

type AddUserFormValues = z.infer<typeof addUserSchema>;

interface AddUserFormProps {
  form: UseFormReturn<AddUserFormValues>;
  onSubmit: SubmitHandler<AddUserFormValues>;
}

const AddUserForm = ({ form, onSubmit }: AddUserFormProps) => {
  return (
    <Form {...form}>
      <form id="add-user-form" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 p-4 sm:p-0">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-2 flex flex-col gap-4">
            <FormField
              control={form.control}
              name="is_superuser"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="cursor-pointer">
                    Is superuser?
                  </FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="cursor-pointer">Is active?</FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};

const AddUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const { showSuccessToast } = useCustomToast();

  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      full_name: "",
      password: "",
      confirm_password: "",
      is_superuser: false,
      is_active: true,
    },
  });

  const {
    reset,
    formState: { isSubmitting },
  } = form;

  const mutation = useMutation({
    mutationFn: (data: UserCreate) =>
      UsersService.createUser({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast("User created successfully.");
      reset();
      setIsOpen(false);
    },
    onError: (err: ApiError) => {
      handleError(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const onSubmit: SubmitHandler<AddUserFormValues> = (data) => {
    const { confirm_password, ...userData } = data;
    mutation.mutate(userData);
  };

  const TriggerButton = (
    <Button className="my-4 flex items-center gap-2" size="sm">
      <FaPlus fontSize="16px" />
      Add User
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Add User</DrawerTitle>
            <DrawerDescription>
              Fill in the form below to add a new user to the system.
            </DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto p-4">
            <AddUserForm form={form} onSubmit={onSubmit} />
          </div>
          <DrawerFooter className="pt-2">
            <Button type="submit" form="add-user-form" disabled={isSubmitting}>
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>
            Fill in the form below to add a new user to the system.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto p-1">
          <AddUserForm form={form} onSubmit={onSubmit} />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form="add-user-form" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUser;
