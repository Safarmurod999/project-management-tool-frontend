import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/shared/api";
import { useAuthStore } from "@/entities/user";
import type { LoginFormData } from "./schema";
import type { LoginResponse } from "@/entities/user";

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: LoginFormData) => authApi.login(data),
    onSuccess: (response: LoginResponse) => {
      const accessToken = response.data;

      const emptyUser = {
        id: "",
        email: "",
        name: "",
        role: { id: "", name: "", code: "" },
        permissions: [],
        createdAt: "",
        updatedAt: "",
      };

      localStorage.setItem("access_token", accessToken);

      localStorage.setItem("user", JSON.stringify(emptyUser));

      setUser(emptyUser);
    },
  });
};
