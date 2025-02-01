interface GoogleUserInfo {
  email: string;
  name: string;
  picture?: string;
}

// 아직은 사용하지 않음
export const authApi = {
  // Google 사용자 정보 가져오기
  getGoogleUserInfo: async (accessToken: string): Promise<GoogleUserInfo> => {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Google user info");
    }

    return response.json();
  },

  // 로그인
  login: async (data: { token: string; email: string; name: string }) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    return response.json();
  },

  // 회원가입
  signup: async (data: { token: string; email: string; name: string }) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Signup failed");
    }

    return response.json();
  },
};
