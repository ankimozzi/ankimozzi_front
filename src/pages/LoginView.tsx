import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { motion } from "framer-motion";
import { useGoogleLogin } from "@react-oauth/google";
import TermsOfServiceModal from "@/components/TermsOfServiceModal";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import { useAuthStore } from "@/store/useAuthStore";

const LoginView = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  /*   1. 유저가 OAuth 버튼 클릭
    2. 구글에서 제공하는 OAuth 정보(access_token) 받아오기
    response 객체
    {
        access_token: "ya29.a0AfB_...", // Google OAuth 토큰
        expires_in: 3599,              // 토큰 만료 시간
        scope: "email profile ...",    // 권한 범위
        token_type: "Bearer"          // 토큰 타입
    }
3. access_token으로 구글 API에서 사용자 정보 가져오기

const user = await authApi.getGoogleUserInfo(response.access_token);
// user 객체
{
  email: "user@gmail.com",
  name: "홍길동",
  picture: "https://..." // 선택적
}

4. 백엔드로 토큰 전송 및 로그인 처리(JWS 토큰 받아서 localStorage에 저장)
const { token } = await authApi.login({
  token: response.access_token,
  email: user.email,
  name: user.name
});

// JWT 토큰을 localStorage에 저장
localStorage.setItem("token", token);

*/
  const login = useGoogleLogin({
    onSuccess: async (response) => {
      setIsLoading(true);
      try {
        const userInfo = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          }
        );

        const user = await userInfo.json();

        // 프로필 이미지 URL 수정
        const pictureUrl = user.picture?.replace("=s96-c", ""); // 크기 파라미터 완전 제거

        useAuthStore.getState().setUser({
          email: user.email,
          name: user.name,
          picture:
            pictureUrl ||
            "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name), // 대체 이미지 서비스 사용
        });

        localStorage.setItem("token", response.access_token);

        toast({
          title: "로그인 성공!",
          description: `환영합니다, ${user.name}님`,
        });

        navigate("/");
      } catch (error) {
        console.error("Login Error:", error);
        toast({
          variant: "destructive",
          title: "로그인 실패",
          description: "구글 로그인에 실패했습니다. 다시 시도해주세요.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "로그인 실패",
        description: "구글 로그인에 실패했습니다. 다시 시도해주세요.",
      });
    },
    flow: "implicit",
  });

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 p-8 bg-white border rounded-xl shadow-lg"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">로그인</h2>
          <p className="mt-2 text-gray-500">Ankimozzi에 오신 것을 환영합니다</p>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full hover:bg-gray-50"
            onClick={() => login()}
            disabled={isLoading}
          >
            <FontAwesomeIcon
              icon={faGoogle as IconProp}
              className="mr-2 h-4 w-4"
            />
            {isLoading ? "로그인 중..." : "Google로 로그인"}
          </Button>

          <div className="text-center text-sm text-gray-500">
            계정이 없으신가요?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-blue-600 hover:underline focus:outline-none"
            >
              회원가입하기
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">
          로그인 시{" "}
          <button
            onClick={() => setShowTerms(true)}
            className="text-blue-600 hover:underline"
          >
            이용약관
          </button>
          과{" "}
          <button
            onClick={() => setShowPrivacyPolicy(true)}
            className="text-blue-600 hover:underline"
          >
            개인정보처리방침
          </button>
          에 동의하게 됩니다
        </div>
      </motion.div>

      <TermsOfServiceModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
      />
      <PrivacyPolicyModal
        isOpen={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
      />
    </div>
  );
};

export default LoginView;
