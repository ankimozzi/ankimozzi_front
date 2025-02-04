import { useQuery } from "@tanstack/react-query";
import { checkDeckStatus, type DeckStatusApiResponse } from "@/api/services";
import { useRef } from "react";

export const useDeckStatus = (deckName: string, shouldPoll: boolean) => {
  const attemptRef = useRef(0); // 시도 횟수를 추적하기 위한 ref

  return useQuery<DeckStatusApiResponse, Error>({
    queryKey: ["deck-status", deckName],
    queryFn: async () => {
      attemptRef.current += 1;
      console.log(
        `🔄 Polling deck status for: ${deckName} (Attempt ${attemptRef.current}/20)`
      );
      try {
        const result = await checkDeckStatus(deckName);
        console.log(`📊 Deck status response:`, result);
        return result;
      } catch (error) {
        console.error(`❌ Polling error:`, error);
        throw error;
      }
    },
    enabled: !!deckName && shouldPoll, // deckName이 있고 shouldPoll이 true일 때만 실행
    staleTime: 3000,
    refetchInterval: 3000,
    retry: 20,
    retryDelay: 3000,
    refetchIntervalInBackground: true,
  });
};
