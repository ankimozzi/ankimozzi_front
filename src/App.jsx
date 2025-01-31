import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GeneratePage from "./pages/GeneratePage";
import FlashcardView from "./pages/FlashcardView";
import DeckListView from "./pages/DeckListView";
import Home from "./pages/Home";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/decks" element={<DeckListView />} />
        <Route path="/generate" element={<GeneratePage />} />
        <Route path="/flashcards/:deckId" element={<FlashcardView />} />
        <Route path="/flashcards" element={<FlashcardView />} />
      </Routes>
    </Router>
  );
};

export default App;
