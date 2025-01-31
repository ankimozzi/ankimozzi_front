import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GeneratePage from "./pages/GeneratePage.tsx";
import FlashcardView from "./pages/FlashcardView.tsx";
import DeckListView from "./pages/DeckListView.tsx";
import Home from "./pages/Home.tsx";
import Header from "./components/Header.tsx";

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
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
