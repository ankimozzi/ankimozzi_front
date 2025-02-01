import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === "/decks") {
      return (
        location.pathname === "/decks" ||
        location.pathname.startsWith("/flashcards")
      );
    }
    return location.pathname === path;
  };

  const isDarkTheme = location.pathname === "/";

  const navigationLinks = [
    { path: "/", label: "Home" },
    { path: "/generate", label: "Generate" },
    { path: "/decks", label: "My Decks" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const AuthButtons = () => {
    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-lg overflow-hidden hover:ring-2 hover:ring-gray-200 transition-all">
              <img
                src={user.picture || "https://placehold.co/400x400"}
                alt={user.name}
                className="w-10 h-10 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/400x400";
                }}
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>로그아웃</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <>
        <button
          className={`text-base font-semibold transition-colors
            ${
              isDarkTheme
                ? "text-gray-300 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => navigate("/signup")}
        >
          Sign up
        </Button>
      </>
    );
  };

  return (
    <header
      className={`
        sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-all duration-300
        ${
          isDarkTheme
            ? "border-white/10 bg-gray-900/90"
            : `border-gray-200/80 bg-white/90 ${
                isScrolled ? "shadow-lg" : "shadow-none"
              }`
        }
      `}
    >
      <div className="mx-auto flex h-16 sm:h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* 로고 */}
        <Link
          to="/"
          className={`
            flex items-center space-x-2 transition-transform duration-200 hover:scale-105
            ${isDarkTheme ? "text-white" : "text-gray-900"}
          `}
        >
          <span className="text-2xl sm:text-3xl font-bold tracking-tight">
            Duel
          </span>
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex items-center space-x-10">
          {navigationLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`
                relative px-2 py-1 text-base font-medium transition-all duration-200
                before:absolute before:inset-0 before:h-full before:w-full before:rounded-lg
                before:transition-colors before:duration-200
                hover:before:bg-gray-100/80
                ${
                  isActive(link.path)
                    ? `${
                        isDarkTheme ? "text-white" : "text-gray-900"
                      } after:absolute after:bottom-[-1.5rem] after:left-0 after:h-[2px] after:w-full after:bg-blue-500 after:transition-all after:duration-200`
                    : `${
                        isDarkTheme
                          ? "text-gray-300 hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`
                }
              `}
            >
              <span className="relative z-10">{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <AuthButtons />
        </div>

        {/* 모바일 메뉴 버튼 */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Menu"
            >
              <Menu
                className={`h-6 w-6 ${
                  isDarkTheme ? "text-white" : "text-gray-900"
                }`}
              />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle className="text-left">Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-8 flex flex-col space-y-4">
              {navigationLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-lg font-semibold transition-colors
                    ${
                      isActive(link.path)
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-2">
                      <img
                        src={user.picture || "https://placehold.co/400x400"}
                        alt={user.name}
                        className="w-10 h-10 rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = "https://placehold.co/400x400";
                        }}
                      />
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-lg font-semibold text-gray-600 hover:text-gray-900"
                      onClick={handleLogout}
                    >
                      로그아웃
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-lg font-semibold text-gray-600 hover:text-gray-900"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </Button>
                    <Button
                      className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => navigate("/signup")}
                    >
                      Sign up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
