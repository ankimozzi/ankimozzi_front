import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategories, fetchDeck, fetchDeckList } from "../api/api";
import Loading from "../components/Loading";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PlusCircle } from "lucide-react";
import { useLoadingStore } from "@/store/useLoadingStore";

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

const DeckListView = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [deckList, setDeckList] = useState<Deck[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { startLoading, completeLoading, isLoading, isComplete } =
    useLoadingStore();
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      startLoading("Loading categories...");
      try {
        const response = await fetchCategories();
        const categoriesData = JSON.parse(response.body);
        setCategories(categoriesData);

        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0]);
          const decksResponse = await fetchDeckList(categoriesData[0]);
          const parsedDecks = JSON.parse(decksResponse.body);
          if (Array.isArray(parsedDecks) && parsedDecks.length > 0) {
            const selectedDeck = parsedDecks.find(
              (deck) => deck.category === categoriesData[0]
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
        completeLoading();
      }
    };
    loadCategories();
  }, []);

  const handleCategoryClick = async (category: string) => {
    startLoading("Loading flashcards...");
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
      completeLoading();
    }
  };

  const handleDeckClick = async (deck: Deck) => {
    const match = deck.question.match(/-(.+?)\.mp4/);
    const extractedString = match ? match[1] : null;

    try {
      if (!extractedString) return;

      startLoading("Loading deck...");
      const response = (await fetchDeck(extractedString)) as ApiResponse;
      const jsonObject = JSON.parse(response.body);

      navigate(`/flashcards/${extractedString}`, {
        state: {
          deckResponse: jsonObject,
        },
      });
    } catch (error) {
      console.error("Error in handleDeckClick:", error);
    } finally {
      completeLoading();
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      {isLoading && <Loading isComplete={isComplete} />}
      <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Video Flashcards
            </h1>
            <p className="mt-1 text-sm sm:text-base text-gray-500">
              Select a category to view flashcards
            </p>
          </div>
          <Button
            onClick={() => navigate("/generate")}
            className="w-full sm:w-auto h-10 text-sm sm:text-base"
          >
            <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Generate
          </Button>
        </div>

        <ScrollArea className="w-full whitespace-nowrap rounded-lg border bg-white p-4 mb-6">
          <div className="flex space-x-4">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={selectedCategory === category ? "default" : "ghost"}
                className={`flex-shrink-0 h-9 sm:h-10 px-4 sm:px-6 text-sm sm:text-base
                  ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <div className="space-y-6">
          {!isLoading &&
            (deckList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {deckList.map((deck, index) => (
                  <button
                    key={index}
                    className="w-full text-left bg-white rounded-xl p-6 shadow-sm hover:shadow-md
                      border border-gray-100 transition-all duration-200"
                    onClick={() => handleDeckClick(deck)}
                  >
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 line-clamp-2">
                      {deck.question}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Click to view flashcards
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-base sm:text-lg text-gray-500">
                  No decks available in this category
                </p>
                <Button
                  onClick={() => navigate("/generate")}
                  variant="outline"
                  className="mt-4"
                >
                  Create your first deck
                </Button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DeckListView;
