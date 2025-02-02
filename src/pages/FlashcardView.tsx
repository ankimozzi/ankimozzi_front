import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboard,
  faDownload,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Document, Paragraph, Packer } from "docx";
import Loading from "@/components/Loading";
import { useDeck } from "@/hooks/queries/useDeck";

interface Flashcard {
  id: number;
  question: string;
  answer: string;
}

interface DeckResponse {
  data?: string;
  status?: string;
  message?: string;
}

interface LocationState {
  deckResponse: DeckResponse;
}

const FlashcardView = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const location = useLocation();
  const { deckResponse } = (location.state as LocationState) || {};
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const { toast } = useToast();
  const [flippedCards, setFlippedCards] = useState<{ [key: number]: boolean }>(
    {}
  );

  const { data: deckData, isLoading } = useDeck(deckId || "");

  useEffect(() => {
    try {
      const data = deckResponse?.data || deckData?.body;

      if (data) {
        const parsedFlashcards = data
          .split("\n")
          .filter((line: string) => line.trim())
          .map((line: string, index: number) => {
            const [answer, question] = line
              .split("\t")
              .map((part: string) => part.trim());
            return {
              id: index,
              question: question || "No question provided",
              answer: answer || "No answer provided",
            };
          });

        setFlashcards(parsedFlashcards);
      } else {
        console.warn("No deck data available.");
      }
    } catch (error) {
      console.error("Error parsing flashcards:", error);
    }
  }, [deckResponse, deckData]);

  const handleCopyAllJSON = () => {
    if (deckResponse?.data) {
      navigator.clipboard.writeText(deckResponse.data);
      toast({
        variant: "default",
        title: "Copied! 📋",
        description: "All flashcards have been copied in Quizlet format.",
        duration: 2000,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No data available to copy.",
      });
    }
  };

  const handleDownloadWord = async () => {
    if (flashcards.length > 0) {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: flashcards.flatMap((card) => [
              new Paragraph({ text: `Question: ${card.question}` }),
              new Paragraph({ text: `Answer: ${card.answer}` }),
              new Paragraph({ text: "" }), // 빈 줄 추가
            ]),
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${deckId}_flashcards.docx`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        variant: "default",
        title: "Downloaded! 📥",
        description: "Word document has been downloaded.",
        duration: 2000,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No flashcards available to download.",
      });
    }
  };

  const handleFlipCard = (cardId: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 space-y-8">
      {isLoading && <Loading isComplete={false} />}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Flashcards for {deckId}
        </h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={handleCopyAllJSON}
            className="flex items-center gap-2 flex-1 sm:flex-initial justify-center"
          >
            <FontAwesomeIcon icon={faClipboard} />
            Copy All
          </Button>
          <Button
            onClick={handleDownloadWord}
            disabled={flashcards.length === 0}
            className="flex items-center gap-2 flex-1 sm:flex-initial justify-center"
          >
            <FontAwesomeIcon icon={faDownload} />
            Word
          </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-1">
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <FontAwesomeIcon icon={faInfoCircle} className="h-4 w-4" />
          Click cards to reveal answers
        </p>
      </div>

      <div className="grid gap-4 max-w-3xl mx-auto">
        {flashcards.length > 0 ? (
          flashcards.map((card, index) => (
            <Card
              key={card.id}
              className="cursor-pointer overflow-hidden transition-all duration-200
                shadow-md hover:shadow-lg bg-gradient-to-br from-white to-gray-50
                dark:from-gray-900 dark:to-gray-800
                border-2 hover:border-gray-300 dark:hover:border-gray-600
                transform hover:-translate-y-0.5"
              onClick={() => handleFlipCard(card.id)}
            >
              <CardContent className="p-4 sm:p-6 relative min-h-[120px]">
                {/* Question */}
                <div
                  className={`w-full transition-all duration-300 ease-in-out transform ${
                    flippedCards[card.id]
                      ? "opacity-0 translate-y-4"
                      : "opacity-100 translate-y-0"
                  }`}
                >
                  <div className="flex items-start">
                    <div
                      className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full 
                      bg-gray-100 dark:bg-gray-800 text-xs sm:text-sm font-semibold mr-2 sm:mr-3 
                      text-gray-600 dark:text-gray-300 shrink-0"
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-muted-foreground mb-1 sm:mb-2">
                        Question
                      </p>
                      <p className="text-sm sm:text-base leading-relaxed">
                        {card.question}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Answer */}
                <div
                  className={`w-full absolute top-0 left-0 p-4 sm:p-6 transition-all duration-300 ease-in-out transform ${
                    flippedCards[card.id]
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-4"
                  }`}
                >
                  <div className="flex items-start">
                    <div
                      className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full 
                      bg-gray-100 dark:bg-gray-800 text-xs sm:text-sm font-semibold mr-2 sm:mr-3 
                      text-gray-600 dark:text-gray-300 shrink-0"
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-muted-foreground mb-1 sm:mb-2">
                        Answer
                      </p>
                      <p className="text-sm sm:text-base leading-relaxed">
                        {card.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="space-y-4">
            <Skeleton className="h-[120px] w-full rounded-lg" />
            <Skeleton className="h-[120px] w-full rounded-lg" />
            <Skeleton className="h-[120px] w-full rounded-lg" />
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardView;
