import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useLogout } from "@/hooks/queries/auth";

const ProfileView = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { toast } = useToast();

  const { mutate: handleLogout, isPending } = useLogout({
    onSuccess: () => {
      toast({
        title: "Logout Successful",
        description: "You have been logged out successfully.",
      });
      navigate("/login");
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "A problem occurred during logout. Please try again.",
      });
    },
  });

  // 로그인되지 않은 상태면 로그인 페이지로 리다이렉트
  if (!user) {
    navigate("/login");
    return null;
  }

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
                src={
                  user.picture ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name
                  )}`
                }
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name
                  )}`;
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
                <h2 className="text-xl font-semibold text-gray-900">
                  Account Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Name
                    </label>
                    <p className="mt-1 text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="mt-1 text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Joined Date
                    </label>
                    <p className="mt-1 text-gray-900">
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
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
                  Manage My Decks
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleLogout()}
                  disabled={isPending}
                >
                  {isPending ? "Logging out..." : "Logout"}
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
