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

const LoginView = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      setIsLoading(true);
      try {
        // Google OAuth 토큰으로 사용자 정보 가져오기
        const userInfo = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          }
        );

        const user = await userInfo.json();

        // 백엔드로 토큰 전송 및 로그인 처리
        const backendResponse = await fetch("YOUR_BACKEND_URL/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: response.access_token,
            email: user.email,
            name: user.name,
          }),
        });

        if (!backendResponse.ok) {
          throw new Error("Login failed");
        }

        const { token } = await backendResponse.json();

        // 토큰 저장
        localStorage.setItem("token", token);

        toast({
          title: "로그인 성공!",
          description: "환영합니다.",
          duration: 2000,
        });

        navigate("/");
      } catch (error) {
        console.error(error);
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
