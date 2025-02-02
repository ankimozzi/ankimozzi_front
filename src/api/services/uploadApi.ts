import axios, { AxiosError } from "axios";
import { BASE_URL } from "../config";
import type { UploadData } from "./index";

export const generateUploadURL = async (data: UploadData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/s3urls`, data, {
      headers: { "Content-Type": "application/json" },
    });

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
