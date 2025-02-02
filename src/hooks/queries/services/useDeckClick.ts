import { useMutation } from "@tanstack/react-query";
import { fetchDeck } from "@/api/services";

export const useDeckClick = () => {
  return useMutation({
    mutationFn: async (deckId: string) => {
      const response = await fetchDeck(deckId);
      return JSON.parse(response.body);
    },
  });
}; 