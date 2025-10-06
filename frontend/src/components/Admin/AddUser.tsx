import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Controller,
  type SubmitHandler,
  useForm,
  type UseFormReturn,
} from "react-hook-form";
import { FaPlus } from "react-icons/fa";

import { type UserCreate, UsersService } from "@/client";
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

interface UserCreateForm extends UserCreate {
  confirm_password: string;
}

interface AddUserFormProps {
  form: UseFormReturn<UserCreateForm>;
  onSubmit: SubmitHandler<UserCreateForm>;
}

const AddUserForm = ({ form, onSubmit }: AddUserFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = form;

  return (
    <form id="add-user-form" onSubmit={handleSubmit(onSubmit)}>
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
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            {...register("password", {
              required: "Password is required",
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
          <Label htmlFor="confirm_password">Confirm Password</Label>
          <Input
            id="confirm_password"
            {...register("confirm_password", {
              required: "Please confirm your password",
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

const AddUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useIsMobile();
  const queryClient = useQueryClient();
  const { showSuccessToast } = useCustomToast();
  const form = useForm<UserCreateForm>({
    mode: "onBlur",
    criteriaMode: "all",
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
    formState: { isValid, isSubmitting },
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

  const onSubmit: SubmitHandler<UserCreateForm> = (data) => {
    mutation.mutate(data);
  };

  const TriggerButton = (
    <Button className="my-4 flex items-center gap-2" size="sm">
      <FaPlus fontSize="16px" />
      Add User
    </Button>
  );

  if (!isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{TriggerButton}</DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground -mt-2">
            Fill in the form below to add a new user to the system.
          </p>
          <div className="max-h-[60vh] overflow-y-auto p-1">
            <AddUserForm form={form} onSubmit={onSubmit} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              form="add-user-form"
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
          <DrawerTitle>Add User</DrawerTitle>
          <p className="text-sm text-muted-foreground">
            Fill in the form below to add a new user to the system.
          </p>
        </DrawerHeader>
        <div className="overflow-y-auto">
          <AddUserForm form={form} onSubmit={onSubmit} />
        </div>
        <DrawerFooter className="pt-2">
          <Button
            type="submit"
            form="add-user-form"
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

export default AddUser;
