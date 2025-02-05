import { useQuery } from "@tanstack/react-query";
import { fetchDeck, type DeckApiResponse } from "@/api/services";

export const useDeck = (deckName: string) => {
  return useQuery<DeckApiResponse, Error>({
    queryKey: ["deck", deckName],
    queryFn: () => fetchDeck(deckName),
    enabled: !!deckName,
    staleTime: 5 * 60 * 1000,
  });
};
