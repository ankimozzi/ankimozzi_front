import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuthStore();
  const { toast } = useToast();

  if (!user) {
    toast({
      variant: "destructive",
      title: "접근 제한",
      description: "로그인이 필요한 서비스입니다.",
    });
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 