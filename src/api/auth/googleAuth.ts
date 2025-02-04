import axios, { AxiosError } from "axios";
import type { GoogleUserInfo } from "./types";

export const getGoogleUserInfo = async (
  accessToken: string
): Promise<GoogleUserInfo> => {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error in getGoogleUserInfo:",
        error.response?.data || error.message
      );
    }
    throw error;
  }
};
