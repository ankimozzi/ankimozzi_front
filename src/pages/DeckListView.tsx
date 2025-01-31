import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategories, fetchDeck, fetchDeckList } from "../api/api";
import Loading from "../components/Loading";

// API 응답 타입
interface ApiResponse {
  statusCode: number;
  body: string;
}

// 덱 리스트 아이템 타입
interface QuestionItem {
  question: string;
  url: string;
}

interface DeckListItem {
  category: string;
  question_list: QuestionItem[];
}

// 컴포넌트에서 사용할 타입
interface Deck {
  question: string;
  url: string;
}

const Home = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [deckList, setDeckList] = useState<Deck[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [deckData, setDeckData] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetchCategories();
        console.log("Categories Response:", response); // 디버깅용
        
        const categoriesData = JSON.parse(response.body);
        setCategories(categoriesData);

        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0]);
          const decksResponse = await fetchDeckList(categoriesData[0]);
          console.log("Decks Response:", decksResponse); // 디버깅용
          
          const parsedDecks = JSON.parse(decksResponse.body);
          if (Array.isArray(parsedDecks) && parsedDecks.length > 0) {
            const selectedDeck = parsedDecks.find(
              deck => deck.category === categoriesData[0]
            );
            if (selectedDeck?.question_list) {
              setDeckList(selectedDeck.question_list);
            }
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadCategories();
  }, []);

  const handleCategoryClick = async (category: string) => {
    setIsLoading(true);
    setSelectedCategory(category);
    try {
      const decksResponse = (await fetchDeckList(category)) as ApiResponse;
      const parsedDecks = JSON.parse(decksResponse.body) as DeckListItem[];
      const selectedDeck = parsedDecks.find(
        (deck) => deck.category === category
      );

      if (selectedDeck) {
        setDeckList(selectedDeck.question_list);
      } else {
        setDeckList([]);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching decks:", error.message);
      }
      setDeckList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeckClick = async (deck: Deck) => {
    const match = deck.question.match(/-(.+?)\.mp4/);
    const extractedString = match ? match[1] : null;
    
    try {
      if (!extractedString) return;
      
      const response = await fetchDeck(extractedString) as ApiResponse;
      console.log("Deck API Response:", response); // 디버깅 추가
      
      const jsonObject = JSON.parse(response.body);
      console.log("Parsed JSON:", jsonObject); // 디버깅 추가

      navigate(`/flashcards/${extractedString}`, {
        state: { 
          deckResponse: jsonObject 
        }
      });
    } catch (error) {
      console.error("Error in handleDeckClick:", error);
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
