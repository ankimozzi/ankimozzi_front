import { useMutation, UseMutationOptions } from "@tanstack/react-query";

interface GoogleUserInfo {
  email: string;
  name: string;
  picture?: string;
}

interface SignupResponse {
  userInfo: GoogleUserInfo;
  accessToken: string;
}

type SignupOptions = UseMutationOptions<SignupResponse, Error, string>;

export const useGoogleSignup = (options?: SignupOptions) => {
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

      const userInfo = (await response.json()) as GoogleUserInfo;

      // 이미 가입된 사용자인지 확인
      const existingUser = localStorage.getItem("user");
      if (existingUser && JSON.parse(existingUser).email === userInfo.email) {
        throw new Error("이미 가입된 이메일입니다.");
      }

      return {
        userInfo,
        accessToken,
      };
    },
    ...options
  });
};
