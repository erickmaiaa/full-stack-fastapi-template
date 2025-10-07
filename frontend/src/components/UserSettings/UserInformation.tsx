import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { type ApiError, UsersService, type UserUpdateMe } from "@/client";
import useAuth from "@/hooks/useAuth";
import useCustomToast from "@/hooks/useCustomToast";
import { handleError } from "@/utils";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const userInformationSchema = z.object({
  full_name: z.string().min(1, "Full name is required."),
  email: z.string().email("Please enter a valid email address."),
});

type UserInformationFormValues = z.infer<typeof userInformationSchema>;

const UserInformation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast } = useCustomToast();
  const [editMode, setEditMode] = useState(false);
  const { user: currentUser } = useAuth();

  const form = useForm<UserInformationFormValues>({
    resolver: zodResolver(userInformationSchema),
    mode: "onBlur",
    defaultValues: {
      full_name: currentUser?.full_name || "",
      email: currentUser?.email || "",
    },
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting, isDirty },
  } = form;

  useEffect(() => {
    if (currentUser) {
      reset({
        full_name: currentUser.full_name || "",
        email: currentUser.email,
      });
    }
  }, [currentUser, reset]);

  const mutation = useMutation({
    mutationFn: (data: UserUpdateMe) =>
      UsersService.updateUserMe({ requestBody: data }),
    onSuccess: (data) => {
      showSuccessToast("User updated successfully.");
      queryClient.setQueryData(["currentUser"], data);
      setEditMode(false);
    },
    onError: (err: ApiError) => {
      handleError(err);
    },
  });

  const onSubmit: SubmitHandler<UserInformationFormValues> = (data) => {
    mutation.mutate(data);
  };

  const onCancel = () => {
    reset();
    setEditMode(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {editMode ? (
              <>
                <FormField
                  control={control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
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
              </>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <p className="text-sm text-muted-foreground">
                    {currentUser?.full_name || "N/A"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <p className="text-sm text-muted-foreground">
                    {currentUser?.email}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            {editMode ? (
              <>
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || !isDirty}>
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </>
            ) : (
              <Button onClick={() => setEditMode(true)}>Edit</Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default UserInformation;
