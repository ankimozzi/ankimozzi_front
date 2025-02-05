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
import { Helmet } from "react-helmet-async";

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
        // 1. Fetch user information from Google
        const googleUser = await fetchGoogleUserInfo(response.access_token);

        // 2. Authenticate using the Lambda function
        const authResult = await authenticateWithGoogle(response.access_token);

        // Adjust profile image URL
        const pictureUrl = googleUser.picture?.replace("=s96-c", "");

        useAuthStore.getState().setUser({
          email: googleUser.email,
          name: googleUser.name,
          picture:
            pictureUrl ||
            "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(googleUser.name),
        });

        // Save the JWT token from the Lambda response
        localStorage.setItem("token", authResult.accessToken);

        toast({
          title: authResult.isNewUser
            ? "Sign Up Successful!"
            : "Login Successful!",
          description: `Welcome, ${googleUser.name}!`,
        });

        navigate("/");
      } catch (error) {
        console.error("Login Error:", error);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Google login failed. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Google login failed. Please try again.",
      });
    },
    flow: "implicit",
  });

  return (
    <>
      <Helmet>
        <title>Duel | Login</title>
        <meta
          name="description"
          content="Login to Duel using Google authentication."
        />
        <meta property="og:title" content="Duel | Login" />
        <meta
          property="og:description"
          content="Login to Duel using Google authentication."
        />
        <link rel="canonical" href="https://your-domain.com/login" />
      </Helmet>
      <div className="h-[calc(100vh-5rem)] bg-white flex items-center justify-center px-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full h-full sm:h-auto sm:max-w-md space-y-6 sm:space-y-8 sm:p-8 p-4 bg-white sm:border sm:rounded-xl sm:shadow-lg flex flex-col justify-center"
        >
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Login
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-500">
              Welcome to Duel
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
              {isLoading ? "Processing..." : "Sign in with Google"}
            </Button>

            <div className="text-center text-xs sm:text-sm text-gray-500">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-blue-600 hover:underline focus:outline-none"
              >
                Sign up
              </button>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 text-center text-xs text-gray-400">
            By logging in, you agree to our{" "}
            <button
              onClick={() => setShowTerms(true)}
              className="text-blue-600 hover:underline"
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <button
              onClick={() => setShowPrivacyPolicy(true)}
              className="text-blue-600 hover:underline"
            >
              Privacy Policy
            </button>
            .
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
    </>
  );
};
