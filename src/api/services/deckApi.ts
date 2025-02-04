import axios, { AxiosError } from "axios";
import { BASE_URL } from "../config";
import type { DeckApiResponse, DeckListApiResponse } from "./index";

// 카테고리별 덱 목록 조회
export const fetchDeckList = async (
  category: string
): Promise<DeckListApiResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/decklist`, {
      params: { category },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error in fetchDeckList:",
        error.response?.data || error.message
      );
    }
    throw error;
  }
};

// 단일 덱 조회
export const fetchDeck = async (deckName: string): Promise<DeckApiResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/deck`, {
      params: { deck_name: deckName },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error in fetchDeck:",
        error.response?.data || error.message
      );
    }
    throw error;
  }
};

export const checkDeckStatus = async (deck_name: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/deck`, {
      params: { deck_name },
    });
    const parsing_response = JSON.parse(response.data.body);
    return parsing_response;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error in checkDeckStatus:",
        error.response?.data || error.message
      );
    }
    throw error;
  }
};
