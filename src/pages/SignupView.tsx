import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle as faGoogleBrand } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TermsOfServiceModal from "@/components/TermsOfServiceModal";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import { useGoogleLogin } from "@react-oauth/google";
import { useToast } from "@/hooks/use-toast";

const SignupView = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const handleGoogleSignup = useGoogleLogin({
    onSuccess: async (response) => {
      setIsLoading(true);
      try {
        // Google OAuth 사용자 정보 가져오기
        const userInfo = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          }
        );

        const user = await userInfo.json();

        // 이미 가입된 사용자인지 확인
        const existingUser = localStorage.getItem("user");
        if (existingUser && JSON.parse(existingUser).email === user.email) {
          toast({
            variant: "destructive",
            title: "회원가입 실패",
            description: "이미 가입된 이메일입니다. 로그인을 시도해주세요.",
          });
          navigate("/login");
          return;
        }

        // 개발용 임시 저장
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: user.email,
            name: user.name,
            picture: user.picture,
            createdAt: new Date().toISOString(), // 가입 시점 추가
          })
        );

        toast({
          title: "회원가입 성공!",
          description: `환영합니다, ${user.name}님`,
          duration: 2000,
        });

        navigate("/");
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "회원가입 실패",
          description: "구글 회원가입에 실패했습니다. 다시 시도해주세요.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "회원가입 실패",
        description: "구글 회원가입에 실패했습니다. 다시 시도해주세요.",
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
          <h2 className="text-3xl font-bold text-gray-900">회원가입</h2>
          <p className="mt-2 text-gray-500">Ankimozzi에 오신 것을 환영합니다</p>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full hover:bg-gray-50"
            onClick={() => handleGoogleSignup()}
            disabled={isLoading}
          >
            <FontAwesomeIcon
              icon={faGoogleBrand as any}
              className="mr-2 h-4 w-4"
            />
            {isLoading ? "처리 중..." : "Google로 회원가입"}
          </Button>

          <div className="text-center text-sm text-gray-500">
            이미 계정이 있으신가요?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline focus:outline-none"
            >
              로그인하기
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

export default SignupView;
