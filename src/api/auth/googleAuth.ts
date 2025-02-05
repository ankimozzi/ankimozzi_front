import axios, { AxiosError } from "axios";
import type { GoogleUserInfo } from "./types";

// Google 유저 정보 가져오기
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

// Lambda 함수 호출
export const authenticateWithGoogle = async (access_token: string) => {
  try {
    const response = await axios.post(
      "https://ykw1cbovbd.execute-api.us-west-1.amazonaws.com/duel_dev/api/auth/google",
      { access_token },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Lambda Auth Error:",
        error.response?.data || error.message
      );
    }
    throw error;
  }
};
