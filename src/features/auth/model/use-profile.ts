import { useAuthStore } from "@/entities/user";
import { authApi } from "@/shared/api";
import { useQuery } from "@tanstack/react-query";

export const useProfile = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      try {
        const response = await authApi.getProfile();

        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));

        return response.data;
      } catch (error) {
        setUser(null);
        throw error;
      }
    },
  });
};
