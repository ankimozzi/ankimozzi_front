import axios, { AxiosError } from "axios";
import { BASE_URL } from "../config";
import type { LoginSignupData } from "./types";

export const login = async (data: LoginSignupData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error in login:", error.response?.data || error.message);
    }
    throw error;
  }
};
