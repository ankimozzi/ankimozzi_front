import axios from "axios";

const BASE_URL =
  "https://ykw1cbovbd.execute-api.us-west-1.amazonaws.com/ankimozzi";

// Fetch categories
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/category`);
    console.log("API Response (Categories):", response.data);

    // Parse response body if it's a JSON string
    const categories = JSON.parse(response.data.body);
    return categories;
  } catch (error) {
    console.error(
      "Error in fetchCategories:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fetch deck list
export const fetchDeckList = async (category) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/decklist`, {
      params: { category }, // Send category as a query parameter
    });

    console.log("API Response (Deck List):", response.data);

    // Parse response body if it's a JSON string
    const decks = JSON.parse(response.data.body);
    const selectedDeck = decks.find((deck) => deck.category === category);
    return selectedDeck ? selectedDeck.question_list : [];
  } catch (error) {
    console.error(
      "Error in fetchDeckList:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fetch a specific deck
export const fetchDeck = async (deckName) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/deck`, {
      params: { deck_name: deckName }, // Send deck_name as a query parameter
    });

    console.log("API Response (Deck):", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in fetchDeck:", error.response?.data || error.message);
    throw error;
  }
};

export const generateUploadURL = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/s3urls`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Raw Server Response:", response.data); // 서버 응답 확인

    // body가 JSON 문자열일 경우 파싱
    const parsedBody = response.data.body
      ? JSON.parse(response.data.body)
      : response.data;

    if (!parsedBody || !parsedBody.uploadUrl) {
      throw new Error("uploadUrl not found in server response");
    }

    return parsedBody.uploadUrl;
  } catch (error) {
    console.error(
      "Error in generateUploadURL:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const checkDeckStatus = async (deck_name) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/deck`, {
      params: { deck_name }, // deckName을 쿼리 파라미터로 전달
    });

    const parsing_response = JSON.parse(response.data.body);
    console.log("Deck Status Response:", parsing_response);
    return parsing_response; // 상태 데이터를 반환
  } catch (error) {
    console.error(
      "Error in checkDeckStatus:",
      error.response?.data || error.message
    );
    throw error;
  }
};
