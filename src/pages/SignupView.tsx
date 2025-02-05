import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle as faGoogleBrand } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TermsOfServiceModal from "@/components/TermsOfServiceModal";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import { useGoogleLogin as useGoogleAuth } from "@react-oauth/google";
import { useGoogleSignup } from "@/hooks/queries/auth";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet-async";

const SignupView = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const { mutate: handleSignup, isPending } = useGoogleSignup({
    onSuccess: (data) => {
      const { userInfo, accessToken } = data;
      const pictureUrl = userInfo.picture?.replace("=s96-c", "");

      localStorage.setItem("token", accessToken);
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: userInfo.email,
          name: userInfo.name,
          picture:
            pictureUrl ||
            "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(userInfo.name),
          createdAt: new Date().toISOString(),
        })
      );

      toast({
        title: "Sign Up Successful!",
        description: `Welcome, ${userInfo.name}!`,
      });

      navigate("/");
    },
    onError: (error) => {
      if (error.message === "Email is already registered.") {
        navigate("/login");
      }
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description:
          error.message || "Google sign up failed. Please try again.",
      });
    },
  });

  const login = useGoogleAuth({
    onSuccess: (response) => handleSignup(response.access_token),
    flow: "implicit",
  });

  return (
    <>
      <Helmet>
        <title>Duel | Sign Up</title>
        <meta
          name="description"
          content="Sign up for Duel using Google authentication."
        />
        <meta property="og:title" content="Duel | Sign Up" />
        <meta
          property="og:description"
          content="Sign up for Duel using Google authentication."
        />
        <link rel="canonical" href="https://duel.work/signup" />
      </Helmet>
      <div className="h-[calc(100vh-5rem)] bg-white flex items-center justify-center px-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full h-full sm:h-auto sm:max-w-md space-y-6 sm:space-y-8 sm:p-8 p-4 bg-white sm:border sm:rounded-xl sm:shadow-lg flex flex-col justify-center"
        >
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Sign Up
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
              disabled={isPending}
            >
              <FontAwesomeIcon
                icon={faGoogleBrand as any}
                className="mr-2 h-3 w-3 sm:h-4 sm:w-4"
              />
              {isPending ? "Processing..." : "Sign Up with Google"}
            </Button>

            <div className="text-center text-xs sm:text-sm text-gray-500">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:underline focus:outline-none"
              >
                Login
              </button>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 text-center text-xs text-gray-400">
            By signing up, you agree to our{" "}
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

export default SignupView;
