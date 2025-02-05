import axios, { AxiosError } from "axios";
import { BASE_URL } from "../config";
import type { CategoryApiResponse } from "./index";

export const fetchCategories = async (): Promise<CategoryApiResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/category`);
    return response.data;
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
