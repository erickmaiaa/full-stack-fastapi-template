import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Controller,
  type SubmitHandler,
  useForm,
  type UseFormReturn,
} from "react-hook-form";
import { FaExchangeAlt } from "react-icons/fa";

import { type UserPublic, UsersService, type UserUpdate } from "@/client";
import type { ApiError } from "@/client/core/ApiError";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { emailPattern, handleError } from "@/utils";

import { Field } from "../ui/field";

interface EditUserProps {
  user: UserPublic;
  asChild?: boolean;
}

interface UserUpdateForm extends UserUpdate {
  confirm_password?: string;
}

interface EditUserFormProps {
  form: UseFormReturn<UserUpdateForm>;
  onSubmit: SubmitHandler<UserUpdateForm>;
}

const EditUserForm = ({ form, onSubmit }: EditUserFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = form;

  return (
    <form id="edit-user-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 p-4 sm:p-0">
        <Field>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: emailPattern,
            })}
            type="email"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </Field>

        <Field>
          <Label htmlFor="full_name">Full Name</Label>
          <Input id="full_name" {...register("full_name")} type="text" />
        </Field>

        <Field>
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            {...register("password", {
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            type="password"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </Field>

        <Field>
          <Label htmlFor="confirm_password">Confirm New Password</Label>
          <Input
            id="confirm_password"
            {...register("confirm_password", {
              validate: (value) =>
                value === getValues().password || "The passwords do not match",
            })}
            type="password"
          />
          {errors.confirm_password && (
            <p className="text-sm text-red-500">
              {errors.confirm_password.message}
            </p>
          )}
        </Field>

        <div className="mt-2 flex flex-col gap-4">
          <Controller
            control={control}
            name="is_superuser"
            render={({ field }) => (
              <Field>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="is_superuser"
                    checked={!!field.value}
                    onCheckedChange={(value) => field.onChange(!!value)}
                  />
                  <Label htmlFor="is_superuser" className="cursor-pointer">
                    Is superuser?
                  </Label>
                </div>
              </Field>
            )}
          />
          <Controller
            control={control}
            name="is_active"
            render={({ field }) => (
              <Field>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="is_active"
                    checked={!!field.value}
                    onCheckedChange={(value) => field.onChange(!!value)}
                  />
                  <Label htmlFor="is_active" className="cursor-pointer">
                    Is active?
                  </Label>
                </div>
              </Field>
            )}
          />
        </div>
      </div>
    </form>
  );
};

const EditUser = ({ user }: EditUserProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useIsMobile();
  const queryClient = useQueryClient();
  const { showSuccessToast } = useCustomToast();
  const form = useForm<UserUpdateForm>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      ...user,
      password: "",
      confirm_password: "",
    },
  });
  const {
    reset,
    formState: { isValid, isSubmitting },
  } = form;

  const mutation = useMutation({
    mutationFn: (data: UserUpdate) =>
      UsersService.updateUser({ userId: user.id, requestBody: data }),
    onSuccess: () => {
      showSuccessToast("User updated successfully.");
      reset({ ...user, password: "", confirm_password: "" });
      setIsOpen(false);
    },
    onError: (err: ApiError) => {
      handleError(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const onSubmit: SubmitHandler<UserUpdateForm> = (data) => {
    const { confirm_password, ...rest } = data;
    if (rest.password === "") {
      rest.password = undefined;
    }
    mutation.mutate(rest);
  };

  const TriggerButton = (
    <Button
      className="flex items-center w-full gap-2 px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
      variant="outline"
    >
      <FaExchangeAlt fontSize="16px" className="mr-1" />
      <span className="font-medium">Edit User</span>
    </Button>
  );

  if (!isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{TriggerButton}</DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground -mt-2">
            Update the user details below.
          </p>
          <div className="max-h-[60vh] overflow-y-auto p-1">
            <EditUserForm form={form} onSubmit={onSubmit} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              form="edit-user-form"
              disabled={!isValid || isSubmitting}
            >
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
          <DrawerTitle>Edit User</DrawerTitle>
          <p className="text-sm text-muted-foreground">
            Update the user details below.
          </p>
        </DrawerHeader>
        <div className="overflow-y-auto">
          <EditUserForm form={form} onSubmit={onSubmit} />
        </div>
        <DrawerFooter className="pt-2">
          <Button
            type="submit"
            form="edit-user-form"
            disabled={!isValid || isSubmitting}
          >
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

export default EditUser;
