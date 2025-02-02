import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateUploadURL, type UploadData } from "@/api/services";

export const useUploadUrl = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UploadData) => generateUploadURL(data),
    // 성공 시 필요한 쿼리 무효화
    onSuccess: () => {
      // 덱 목록이 변경될 수 있으므로 관련 쿼리들을 무효화
      queryClient.invalidateQueries({
        queryKey: ["decks"], // 덱 관련 모든 쿼리
      });

      // 특정 카테고리의 덱만 무효화
      queryClient.invalidateQueries({
        queryKey: ["decks", "category-name"],
        exact: true,
      });
    },
  });
};
