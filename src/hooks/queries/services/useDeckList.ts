import { useQuery } from "@tanstack/react-query";
import { fetchDeckList, type DeckListApiResponse } from "@/api/services";

export const useDeckList = (category: string) => {
  return useQuery<DeckListApiResponse, Error>({
    queryKey: ["decklist", category],
    queryFn: () => fetchDeckList(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000, // 5분
  });
};
