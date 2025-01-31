import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faDownload } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

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

  useEffect(() => {
    console.log("Deck Response:", deckResponse);
    if (deckResponse?.data) {
      try {
        const parsedFlashcards = deckResponse.data
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
      } catch (error) {
        console.error("Error parsing flashcards:", error);
      }
    } else {
      console.warn("No deck data available.");
    }
  }, [deckResponse]);

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

  const handleDownloadWord = () => {
    if (flashcards.length > 0) {
      const content = flashcards
        .map((card) => `A: ${card.answer}\nQ: ${card.question}\n`)
        .join("\n");
      const blob = new Blob([content], { type: "application/msword" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${deckId}_flashcards.doc`;
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
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">
          Flashcards for {deckId}
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCopyAllJSON}
            className="flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faClipboard} />
            Copy All
          </Button>
          <Button
            onClick={handleDownloadWord}
            disabled={flashcards.length === 0}
            className="flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faDownload} />
            Download as Word
          </Button>
        </div>
      </div>

      <div className="grid gap-3 max-w-3xl mx-auto">
        {flashcards.length > 0 ? (
          flashcards.map((card, index) => (
            <Card
              key={card.id}
              onClick={() => handleFlipCard(card.id)}
              className="cursor-pointer relative min-h-[120px]"
            >
              <CardContent className="p-4">
                <div
                  className={`transition-all duration-300 ${
                    flippedCards[card.id] ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-muted-foreground mb-1">
                        Question {index + 1}
                      </p>
                      <p className="text-base">{card.question}</p>
                    </div>
                  </div>
                </div>
                <div
                  className={`absolute inset-0 p-4 transition-all duration-300 ${
                    flippedCards[card.id] ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-muted-foreground mb-1">
                        Answer {index + 1}
                      </p>
                      <p className="text-base">{card.answer}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="space-y-3">
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
