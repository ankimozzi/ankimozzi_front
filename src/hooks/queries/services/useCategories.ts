import { useQuery } from "@tanstack/react-query";
import { fetchCategories, type CategoryApiResponse } from "@/api/services";

export const useCategories = () => {
  return useQuery<CategoryApiResponse, Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 60 * 60 * 1000, // 카테고리는 자주 변경되지 않으므로 1시간
  });
};
