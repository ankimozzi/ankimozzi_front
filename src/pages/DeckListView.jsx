import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategories, fetchDeck, fetchDeckList } from "../api/api";
import Loading from "./Loading";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [deckList, setDeckList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [deckData, setDeckData] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0]);
          const decks = await fetchDeckList(categoriesData[0]);
          setDeckList(decks);
        }
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadCategories();
  }, []);

  const handleCategoryClick = async (category) => {
    setIsLoading(true);
    setSelectedCategory(category);
    try {
      const decks = await fetchDeckList(category);
      setDeckList(decks);
    } catch (error) {
      console.error("Error fetching decks:", error.message);
      setDeckList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeckClick = async (deckName) => {
    const match = deckName.question.match(/-(.+?)\.mp4/);
    const extractedString = match ? match[1] : null;
    try {
      const decks = await fetchDeck(extractedString);
      setDeckData(decks.body);
      const jsonObject = JSON.parse(decks.body);

      navigate(`/flashcards/${extractedString}`, {
        state: { deckResponse: jsonObject },
      });
    } catch (error) {
      console.error("Error fetching decks:", error.message);
      setDeckList([]);
    }
  };

  return (
    <div className="font-inter p-5">
      {isLoading && <Loading message="Loading flashcards..." />}

      <header className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Video Flashcards</h1>
        <button
          className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-base rounded transition-colors duration-300"
          onClick={() => navigate("/generate")}
          aria-label="Generate new flashcards"
        >
          + Generate
        </button>
      </header>

      <nav className="flex justify-start gap-4 mb-8">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`relative text-base font-semibold text-primary hover:text-primary-dark transition-colors duration-300
              ${
                selectedCategory === category
                  ? "after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-1 after:bg-primary"
                  : ""
              }`}
            onClick={() => handleCategoryClick(category)}
            aria-label={`Select ${category} category`}
            aria-selected={selectedCategory === category}
          >
            {category}
          </button>
        ))}
      </nav>

      <div className="bg-gray-50 p-5 -mx-5 min-h-[calc(100vh-250px)] relative">
        <h2 className="mb-4 text-lg font-semibold">Flashcard Sets</h2>
        {!isLoading &&
          (deckList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {deckList.map((deck, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-gray-100 rounded-xl p-8 text-left cursor-pointer
                    hover:border-primary-light active:border-primary transition-all duration-300"
                  onClick={() => handleDeckClick(deck)}
                  onKeyDown={(e) => e.key === "Enter" && handleDeckClick(deck)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open flashcard deck: ${deck.question}`}
                >
                  <h3 className="text-lg font-medium text-gray-800 m-0">
                    {deck.question}
                  </h3>
                </div>
              ))}
            </div>
          ) : (
            <p
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
              text-lg text-gray-500 text-center pointer-events-none"
            >
              No decks available
            </p>
          ))}
      </div>
    </div>
  );
};

export default Home;
