import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
  Link,
  redirect,
} from "@tanstack/react-router";
import { useForm, type SubmitHandler } from "react-hook-form";

import { LoginService, type ApiError, type NewPassword } from "@/client";
import useCustomToast from "@/hooks/useCustomToast";
import { passwordRules, confirmPasswordRules, handleError } from "@/utils";
import { cn } from "@/lib/utils";
import { buttonVariants, Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const token = new URLSearchParams(window.location.search).get("token");

interface NewPasswordForm extends NewPassword {
  confirm_password: string;
}

export const Route = createFileRoute("/_auth_layout/reset-password")({
  component: ResetPassword,
  beforeLoad: async () => {
    if (!token) {
      throw redirect({
        to: "/",
      });
    }
  },
});

function ResetPassword() {
  return (
    <div className="relative grid h-screen flex-1 shrink-0 items-center md:grid lg:max-w-none lg:px-0">
      <Link
        to="/login"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute top-4 right-4 md:top-8 md:right-8"
        )}
      >
        Login
      </Link>
      <div className="flex items-center justify-center p-8">
        <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Reset Password
            </h1>
            <p className="text-muted-foreground text-sm">
              Enter your new password below
            </p>
          </div>
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<NewPasswordForm>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;
  const { showSuccessToast } = useCustomToast();
  const navigate = useNavigate();

  const resetPasswordMutation = useMutation({
    mutationFn: (data: NewPassword) =>
      LoginService.resetPassword({
        requestBody: { new_password: data.new_password, token: token || "" },
      }),
    onSuccess: () => {
      showSuccessToast("Password updated successfully.");
      reset();
      navigate({ to: "/login" });
    },
    onError: (err: ApiError) => {
      handleError(err);
    },
  });

  const onSubmit: SubmitHandler<NewPasswordForm> = (data) => {
    resetPasswordMutation.mutate(data);
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="new_password"
              rules={passwordRules()}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_password"
              rules={confirmPasswordRules(form.getValues)}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isSubmitting} className="mt-2">
              {isSubmitting && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Reset Password
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
