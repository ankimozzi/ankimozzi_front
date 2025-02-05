import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GeneratePage from "./pages/GeneratePage.tsx";
import FlashcardView from "./pages/FlashcardView.tsx";
import DeckListView from "./pages/DeckListView.tsx";
import Home from "./pages/Home.tsx";
import Header from "./components/Header.tsx";
import { Toaster } from "@/components/ui/toaster";
import { LoginView } from "./pages/LoginView.tsx";
import SignupView from "./pages/SignupView.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ProfileView from "./pages/ProfileView.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient();

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <Router>
            <div className="flex min-h-screen flex-col bg-gray-50">
              <Header />
              <main className="flex-grow" role="main">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/generate" element={<GeneratePage />} />
                  <Route path="/decks" element={<DeckListView />} />
                  <Route
                    path="/flashcards/:deckId"
                    element={<FlashcardView />}
                  />
                  <Route path="/flashcards" element={<FlashcardView />} />
                  <Route path="/login" element={<LoginView />} />
                  <Route path="/signup" element={<SignupView />} />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfileView />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
              <footer className="mt-auto py-4 text-center text-sm text-gray-600">
                <p>© 2024 Duel. All rights reserved.</p>
              </footer>
              <Toaster />
            </div>
          </Router>
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
