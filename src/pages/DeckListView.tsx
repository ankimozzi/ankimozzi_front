import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PlusCircle } from "lucide-react";
import { useCategories } from "@/hooks/queries/useCategories";
import { useDeckList } from "@/hooks/queries/useDeckList";
import { useDeckClick } from "@/hooks/queries/useDeckClick";
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
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const navigate = useNavigate();

  // React Query 훅 사용
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useCategories();

  const { data: deckListData, isLoading: isDeckListLoading } =
    useDeckList(selectedCategory);

  const { mutateAsync: fetchDeckData } = useDeckClick();

  // 카테고리 데이터가 로드되면 첫 번째 카테고리 선택
  useEffect(() => {
    if (categoriesData?.body) {
      const categories = JSON.parse(categoriesData.body);
      if (categories.length > 0 && !selectedCategory) {
        setSelectedCategory(categories[0]);
      }
    }
  }, [categoriesData]);

  // 데이터 파싱 헬퍼 함수들
  const categories = useMemo(() => {
    if (!categoriesData?.body) return [];
    return JSON.parse(categoriesData.body);
  }, [categoriesData]);

  const deckList = useMemo(() => {
    if (!deckListData?.body) return [];
    const parsedDecks = JSON.parse(deckListData.body);
    const selectedDeck = parsedDecks.find(
      (deck: DeckListItem) => deck.category === selectedCategory
    );
    return selectedDeck?.question_list || [];
  }, [deckListData, selectedCategory]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleDeckClick = async (deck: Deck) => {
    const match = deck.question.match(/-(.+?)\.mp4/);
    const extractedString = match ? match[1] : null;

    if (!extractedString) return;

    try {
      const deckResponse = await fetchDeckData(extractedString);

      navigate(`/flashcards/${extractedString}`, {
        state: {
          deckResponse,
        },
      });
    } catch (error) {
      console.error("Error fetching deck:", error);
    }
  };

  // 로딩 상태 통합
  const isLoading = isCategoriesLoading || isDeckListLoading;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      {isLoading && <Loading isComplete={false} />}
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
            {categories.map((category: string, index: number) => (
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
                {deckList.map((deck: Deck, index: number) => (
                  <button
                    key={index}
                    className="w-full text-left bg-white rounded-xl p-6 shadow-sm hover:shadow-md
                      border border-gray-100 transition-all duration-200"
                    onClick={() => handleDeckClick(deck)}
                  >
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 line-clamp-2">
                      {deck.question
                        .replace("transcribe-", "")
                        .replace(".mp4", "")}
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
