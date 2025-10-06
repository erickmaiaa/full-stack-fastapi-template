import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { type SubmitHandler, useForm } from "react-hook-form";

import { type ApiError, LoginService } from "@/client";
import useCustomToast from "@/hooks/useCustomToast";
import { emailPattern, handleError } from "@/utils";
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

interface FormData {
  email: string;
}

export const Route = createFileRoute("/_auth_layout/recover-password")({
  component: RecoverPassword,
});

function RecoverPassword() {
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
              Password Recovery
            </h1>
            <p className="text-muted-foreground text-sm">
              Enter your email to receive a recovery link
            </p>
          </div>
          <RecoverPasswordForm />
        </div>
      </div>
    </div>
  );
}

export function RecoverPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<FormData>({
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;
  const { showSuccessToast } = useCustomToast();

  const recoverPasswordMutation = useMutation({
    mutationFn: (data: FormData) =>
      LoginService.recoverPassword({ email: data.email }),
    onSuccess: () => {
      showSuccessToast("Password recovery email sent successfully.");
      reset();
    },
    onError: (err: ApiError) => {
      handleError(err);
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    recoverPasswordMutation.mutate(data);
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              rules={{
                required: "Email is required.",
                pattern: emailPattern,
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isSubmitting} className="mt-2">
              {isSubmitting && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
