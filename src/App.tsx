import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GeneratePage from "./pages/GeneratePage.tsx";
import FlashcardView from "./pages/FlashcardView.tsx";
import DeckListView from "./pages/DeckListView.tsx";
import Home from "./pages/Home.tsx";
import Header from "./components/Header.tsx";
import { Toaster } from "@/components/ui/toaster";
import LoginView from "./pages/LoginView.tsx";
import SignupView from "./pages/SignupView.tsx";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/decks" element={<DeckListView />} />
            <Route path="/generate" element={<GeneratePage />} />
            <Route path="/flashcards/:deckId" element={<FlashcardView />} />
            <Route path="/flashcards" element={<FlashcardView />} />

            <Route path="/login" element={<LoginView />} />
            <Route path="/signup" element={<SignupView />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
};

export default App;
