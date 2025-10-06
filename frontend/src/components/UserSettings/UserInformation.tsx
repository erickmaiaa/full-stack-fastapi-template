import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

import {
  type ApiError,
  type UserPublic,
  UsersService,
  type UserUpdateMe,
} from "@/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useAuth from "@/hooks/useAuth";
import useCustomToast from "@/hooks/useCustomToast";
import { emailPattern, handleError } from "@/utils";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const UserInformation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast } = useCustomToast();
  const [editMode, setEditMode] = useState(false);
  const { user: currentUser } = useAuth();
  const form = useForm<UserPublic>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      full_name: currentUser?.full_name,
      email: currentUser?.email,
    },
  });
  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting, isDirty },
  } = form;

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const mutation = useMutation({
    mutationFn: (data: UserUpdateMe) =>
      UsersService.updateUserMe({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast("User updated successfully.");
      setEditMode(false);
    },
    onError: (err: ApiError) => {
      handleError(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries();
    },
  });

  const onSubmit: SubmitHandler<UserUpdateMe> = async (data) => {
    mutation.mutate(data);
  };

  const onCancel = () => {
    reset({
      full_name: currentUser?.full_name,
      email: currentUser?.email,
    });
    toggleEditMode();
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
                  rules={{ required: "Full name is required." }}
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
                  rules={{
                    required: "Email is required.",
                    pattern: emailPattern,
                  }}
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
                    {currentUser?.full_name}
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
              <Button onClick={toggleEditMode}>Edit</Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default UserInformation;
