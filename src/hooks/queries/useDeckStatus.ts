import { useQuery } from "@tanstack/react-query";
import { checkDeckStatus, type DeckStatusApiResponse } from "@/api/services";

export const useDeckStatus = (deckName: string) => {
  return useQuery<DeckStatusApiResponse, Error>({
    queryKey: ["deck-status", deckName],
    queryFn: () => checkDeckStatus(deckName),
    enabled: !!deckName,
    // 상태 체크는 더 자주 업데이트가 필요할 수 있음
    staleTime: 30 * 1000, // 30초
    refetchInterval: 30 * 1000, // 30초마다 자동으로 상태 체크
  });
};
