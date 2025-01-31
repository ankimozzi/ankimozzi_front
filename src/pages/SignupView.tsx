import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle as faGoogleBrand } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SignupView = () => {
  const navigate = useNavigate();

  const handleGoogleSignup = () => {
    // Google 회원가입 로직 구현
    console.log("Google signup clicked");
  };

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
            onClick={handleGoogleSignup}
          >
            <FontAwesomeIcon
              icon={faGoogleBrand as any}
              className="mr-2 h-4 w-4"
            />
            Google로 회원가입
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
          회원가입 시{" "}
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

export default SignupView;
