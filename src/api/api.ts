import axios, { AxiosError } from "axios";

const BASE_URL =
  "https://ykw1cbovbd.execute-api.us-west-1.amazonaws.com/ankimozzi";

interface DeckItem {
  category: string;
  question_list: string[];
}

interface ApiResponse {
  statusCode: number; // HTTP 상태 코드 (200, 404 등)
  body: string; // JSON 문자열 형태의 실제 데이터
}

// 필요한 경우 파싱된 데이터의 타입도 정의할 수 있습니다
interface ParsedDeckList {
  category: string;
  question_list: {
    question: string;
    url: string;
  }[];
}

// Fetch categories
export const fetchCategories = async (): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/category`);
    return response.data; // API가 이미 ApiResponse 형태로 반환
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error in fetchCategories:",
        error.response?.data || error.message
      );
    }
    throw error;
  }
};

// Fetch deck list
export const fetchDeckList = async (category: string): Promise<ApiResponse> => {
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

// Fetch a specific deck
export const fetchDeck = async (deckName: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/deck`, {
      params: { deck_name: deckName },
    });

    console.log("API Response (Deck):", response.data);
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

interface UploadData {
  [key: string]: string | number | boolean;
}

export const generateUploadURL = async (data: UploadData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/s3urls`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Raw Server Response:", response.data);

    const parsedBody = response.data.body
      ? JSON.parse(response.data.body)
      : response.data;

    if (!parsedBody || !parsedBody.uploadUrl) {
      throw new Error("uploadUrl not found in server response");
    }

    return parsedBody.uploadUrl;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error in generateUploadURL:",
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
    console.log("Deck Status Response:", parsing_response);
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
