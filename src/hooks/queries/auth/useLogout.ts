import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";

type LogoutOptions = UseMutationOptions<void, Error, void>;

export const useLogout = (options?: LogoutOptions) => {
  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem("token");
      useAuthStore.getState().logout();
    },
    ...options,
  });
};
