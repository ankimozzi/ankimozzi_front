import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { motion } from "framer-motion";

interface LoginCredentials {
  email: string;
  password: string;
}

const LoginView = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // API 호출 함수
      // await loginWithEmail(credentials);
      toast({
        title: "로그인 성공!",
        description: "환영합니다.",
        duration: 2000,
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "로그인 실패",
        description: "이메일 또는 비밀번호를 확인해주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // API 호출 함수
      // await loginWithGoogle();
      toast({
        title: "로그인 성공!",
        description: "환영합니다.",
        duration: 2000,
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "로그인 실패",
        description: "구글 로그인에 실패했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            onClick={handleGoogleLogin}
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
          <a href="#" className="text-blue-600 hover:underline">
            이용약관
          </a>
          과{" "}
          <a href="#" className="text-blue-600 hover:underline">
            개인정보 처리방침
          </a>
          에 동의하게 됩니다
        </div>
      </motion.div>
    </div>
  );
};

export default LoginView;
