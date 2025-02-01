import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const ProfileView = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // 로그인되지 않은 상태면 로그인 페이지로 리다이렉트
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      logout();
      toast({
        title: "로그아웃 성공",
        description: "안전하게 로그아웃되었습니다.",
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
      toast({
        variant: "destructive",
        title: "로그아웃 실패",
        description: "로그아웃 중 문제가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <div className="flex flex-col items-center space-y-6">
            {/* 프로필 이미지 */}
            <div className="relative">
              <img
                src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`;
                }}
              />
            </div>

            {/* 사용자 정보 */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500">{user.email}</p>
            </div>

            {/* 계정 정보 섹션 */}
            <div className="w-full max-w-md space-y-6">
              <div className="border rounded-lg p-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">계정 정보</h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">이름</label>
                    <p className="mt-1 text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">이메일</label>
                    <p className="mt-1 text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">가입일</label>
                    <p className="mt-1 text-gray-900">
                      {new Date().toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* 작업 버튼들 */}
              <div className="flex flex-col space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/decks")}
                >
                  내 덱 관리
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  {isLoading ? "로그아웃 중..." : "로그아웃"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileView; 