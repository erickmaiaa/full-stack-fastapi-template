import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import * as React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { LoginService, type ApiError } from "@/client";
import { Icons } from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { handleError } from "@/utils";

const resetPasswordSearchSchema = z.object({
  token: z.string(),
});

const resetPasswordSchema = z
  .object({
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters long."),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const Route = createFileRoute("/_auth_layout/reset-password")({
  component: ResetPassword,
  validateSearch: (search) =>
    resetPasswordSearchSchema.parse(search).token
      ? resetPasswordSearchSchema.parse(search)
      : redirect({ to: "/" }),
});

function ResetPasswordForm({
  token,
  className,
  ...props
}: React.ComponentProps<"div"> & { token: string }) {
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
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
    mutationFn: (data: ResetPasswordFormValues) =>
      LoginService.resetPassword({
        requestBody: { new_password: data.new_password, token },
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

  const onSubmit: SubmitHandler<ResetPasswordFormValues> = (data) => {
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

function ResetPassword() {
  const { token } = Route.useSearch() as { token: string };

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
          <ResetPasswordForm token={token} />
        </div>
      </div>
    </div>
  );
}
