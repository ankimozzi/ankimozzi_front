import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { motion } from "framer-motion";
import { useGoogleLogin as useGoogleAuth } from "@react-oauth/google";
import TermsOfServiceModal from "@/components/TermsOfServiceModal";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import { useAuthStore } from "@/store/useAuthStore";
import { useGoogleLogin } from "@/hooks/queries/auth";
import { authenticateWithGoogle } from "@/api/auth/googleAuth";

export const LoginView = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const { mutateAsync: fetchGoogleUserInfo } = useGoogleLogin();

  const login = useGoogleAuth({
    onSuccess: async (response) => {
      setIsLoading(true);
      try {
        // 1. Google에서 유저 정보 가져오기
        const googleUser = await fetchGoogleUserInfo(response.access_token);

        // 2. Lambda 함수로 인증 처리
        const authResult = await authenticateWithGoogle(response.access_token);

        // 프로필 이미지 URL 수정
        const pictureUrl = googleUser.picture?.replace("=s96-c", "");

        useAuthStore.getState().setUser({
          email: googleUser.email,
          name: googleUser.name,
          picture:
            pictureUrl ||
            "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(googleUser.name),
        });

        // Lambda에서 받은 JWT 토큰 저장
        localStorage.setItem("token", authResult.accessToken);

        toast({
          title: authResult.isNewUser ? "회원가입 성공!" : "로그인 성공!",
          description: `환영합니다, ${googleUser.name}님`,
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
    <div className="h-[calc(100vh-5rem)] bg-white flex items-center justify-center px-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full h-full sm:h-auto sm:max-w-md space-y-6 sm:space-y-8 sm:p-8 p-4 bg-white sm:border sm:rounded-xl sm:shadow-lg flex flex-col justify-center"
      >
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            로그인
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-500">
            Ankimozzi에 오신 것을 환영합니다
          </p>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full hover:bg-gray-50 text-sm sm:text-base py-6 sm:py-4"
            onClick={() => login()}
            disabled={isLoading}
          >
            <FontAwesomeIcon
              icon={faGoogle as IconProp}
              className="mr-2 h-3 w-3 sm:h-4 sm:w-4"
            />
            {isLoading ? "처리 중..." : "Google로 로그인"}
          </Button>

          <div className="text-center text-xs sm:text-sm text-gray-500">
            계정이 없으신가요?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-blue-600 hover:underline focus:outline-none"
            >
              회원가입하기
            </button>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 text-center text-xs text-gray-400">
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
