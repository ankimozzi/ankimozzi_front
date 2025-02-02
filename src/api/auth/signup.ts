import axios, { AxiosError } from "axios";
import { BASE_URL } from "../config";
import type { LoginSignupData } from "./types";

export const signup = async (data: LoginSignupData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/signup`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error in signup:", error.response?.data || error.message);
    }
    throw error;
  }
};
