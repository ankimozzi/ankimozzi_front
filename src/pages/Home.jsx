import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategories, fetchDeck, fetchDeckList } from "../api/api";
import "../styles/Home.css";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [deckList, setDeckList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [deckData, setDeckData] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        // 첫 번째 카테고리 자동 선택 및 해당 카테고리의 덱 로드
        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0]);
          const decks = await fetchDeckList(categoriesData[0]);
          setDeckList(decks);
        }
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };
    loadCategories();
  }, []);

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    try {
      const decks = await fetchDeckList(category);
      setDeckList(decks);
    } catch (error) {
      console.error("Error fetching decks:", error.message);
      setDeckList([]);
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
    <div className="font-['Inter'] p-5">
      <header className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Video Flashcards</h1>
        <button
          className="px-5 py-2.5 bg-[#4255ff] text-white text-base rounded hover:bg-[#222fa1] transition-colors"
          onClick={() => navigate("/generate")}
        >
          + Generate
        </button>
      </header>

      <nav className="flex justify-start gap-4 mb-8">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`relative text-base font-semibold text-[#4255ff] hover:text-[#222fa1] transition-colors
              ${
                selectedCategory === category
                  ? "after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-1 after:bg-[#4255ff]"
                  : ""
              }`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </nav>

      <div className="bg-[#f6f7fb] p-5 -mx-5 min-h-[calc(100vh-250px)] relative">
        <h2 className="mb-4">Flashcard Sets</h2>
        {deckList.length > 0 ? (
          <div className="grid grid-cols-3 gap-5">
            {deckList.map((deck, index) => (
              <div
                key={index}
                className="bg-white border-2 border-[#edeff5] rounded-xl p-8 text-left cursor-pointer
                  hover:border-[#a0aaff] active:border-[#4255ff] transition-all"
                onClick={() => handleDeckClick(deck)}
              >
                <h3 className="text-[1.1rem] font-medium text-gray-800 m-0">
                  {deck.question}
                </h3>
              </div>
            ))}
          </div>
        ) : (
          <p
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
            text-[1.2rem] text-gray-500 text-center pointer-events-none"
          >
            No decks available
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
