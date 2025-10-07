import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import {
  type Body_login_login_access_token as AccessToken,
  type ApiError,
  LoginService,
  type UserPublic,
  type UserCreate,
  UsersService,
} from "@/client";
import { handleError } from "@/utils";

const isLoggedIn = () => {
  return localStorage.getItem("access_token") !== null;
};

const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<UserPublic | null, Error>({
    queryKey: ["currentUser"],
    queryFn: UsersService.readUserMe,
    enabled: isLoggedIn(),
  });

  const loginMutation = useMutation({
    mutationFn: async (data: AccessToken) => {
      const response = await LoginService.loginAccessToken({
        formData: data,
      });
      localStorage.setItem("access_token", response.access_token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      navigate({ to: "/" });
    },
    onError: (err: ApiError) => {
      handleError(err);
    },
  });

  const signUpMutation = useMutation({
    mutationFn: (data: UserCreate) =>
      UsersService.registerUser({ requestBody: data }),
    onSuccess: () => {
      navigate({ to: "/login" });
    },
    onError: (err: ApiError) => {
      handleError(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const logout = () => {
    localStorage.removeItem("access_token");
    queryClient.removeQueries({ queryKey: ["currentUser"] });
    navigate({ to: "/login" });
  };

  return {
    loginMutation,
    signUpMutation,
    logout,
    user,
    isLoggedIn: isLoggedIn(),
    isLoading,
  };
};

export { isLoggedIn };
export default useAuth;
