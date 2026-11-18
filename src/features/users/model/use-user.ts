import { useAuthStore } from "@/entities/user";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/shared/api/user";

export const useUsers = () => {
  const setUsers = useAuthStore((state) => state.setUsers);

  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const response = await userApi.getAll();
        setUsers(response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
    },
  });
};
