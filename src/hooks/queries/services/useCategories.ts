import { useQuery } from "@tanstack/react-query";
import { fetchCategories, type CategoryApiResponse } from "@/api/services";

export const useCategories = () => {
  return useQuery<CategoryApiResponse, Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 60 * 60 * 1000, // 1시간마다 데이터 갱신
  });
};
