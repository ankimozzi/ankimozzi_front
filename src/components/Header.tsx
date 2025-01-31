import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isDarkTheme = location.pathname === "/";

  return (
    <header
      className={`
      sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-shadow duration-200
      ${
        isDarkTheme
          ? "border-white/10 bg-gray-900/80"
          : `border-gray-200 bg-white ${isScrolled ? "shadow-md" : "shadow-sm"}`
      }
    `}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* 로고 */}
        <Link to="/" className="flex items-center space-x-2">
          <span
            className={`text-3xl font-semibold ${
              isDarkTheme ? "text-white" : "text-gray-900"
            }`}
          >
            Duel
          </span>
        </Link>

        {/* 네비게이션 */}
        <nav className="flex items-center space-x-8">
          <Link
            to="/"
            className={`relative text-base font-semibold transition-colors
              ${
                isActive("/")
                  ? `${
                      isDarkTheme ? "text-white" : "text-gray-900"
                    } after:absolute after:bottom-[-24px] after:left-0 after:h-[3px] after:w-full after:bg-blue-600`
                  : `${
                      isDarkTheme
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`
              }`}
          >
            Home
          </Link>
          <Link
            to="/generate"
            className={`relative text-base font-semibold transition-colors
              ${
                isActive("/generate")
                  ? `${
                      isDarkTheme ? "text-white" : "text-gray-900"
                    } after:absolute after:bottom-[-24px] after:left-0 after:h-[3px] after:w-full after:bg-blue-600`
                  : `${
                      isDarkTheme
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`
              }`}
          >
            Generate
          </Link>
          <Link
            to="/decks"
            className={`relative text-base font-semibold transition-colors
              ${
                isActive("/decks")
                  ? `${
                      isDarkTheme ? "text-white" : "text-gray-900"
                    } after:absolute after:bottom-[-24px] after:left-0 after:h-[3px] after:w-full after:bg-blue-600`
                  : `${
                      isDarkTheme
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`
              }`}
          >
            My Decks
          </Link>
        </nav>

        {/* 로그인/회원가입 버튼 */}
        <div className="flex items-center space-x-4">
          <button
            className={`text-base font-semibold transition-colors
            ${
              isDarkTheme
                ? "text-gray-300 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Login
          </button>
          <button className="rounded-lg bg-blue-600 px-6 py-3 text-base font-bold text-white transition-colors hover:bg-blue-700">
            Sign up
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
