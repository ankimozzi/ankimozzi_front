import { useMutation } from "@tanstack/react-query";

interface GoogleUserInfo {
  email: string;
  name: string;
  picture?: string;
}

export const useGoogleLogin = () => {
  return useMutation({
    mutationFn: async (accessToken: string) => {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user info");
      }

      return response.json() as Promise<GoogleUserInfo>;
    },
  });
};
