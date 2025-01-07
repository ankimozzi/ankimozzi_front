import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GeneratePage from "./pages/GeneratePage";
import Loading from "./pages/Loading";
import FlashcardView from "./pages/FlashcardView";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generate" element={<GeneratePage />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/flashcards/:deckId" element={<FlashcardView />} />
        <Route path="/flashcards" element={<FlashcardView />} />
      </Routes>
    </Router>
  );
};

export default App;
