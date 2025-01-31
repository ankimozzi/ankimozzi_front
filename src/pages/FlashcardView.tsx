import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faDownload } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  console.log("Location State:", location.state);

  const { deckResponse } = (location.state as LocationState) || {};
  console.log("Deck Response:", deckResponse);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const { toast } = useToast();

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

  const handleCopyFlashcard = (card: Flashcard) => {
    navigator.clipboard.writeText(`${card.answer}    ${card.question}`);
    toast({
      title: "Copied!",
      description: "Flashcard copied to clipboard",
      duration: 2000,
    });
  };

  const handleCopyAllJSON = () => {
    if (deckResponse?.data) {
      navigator.clipboard.writeText(deckResponse.data);
      toast({
        title: "Success",
        description: "All flashcards copied for Quizlet",
        duration: 2000,
      });
    } else {
      toast({
        title: "Error",
        description: "No data available to copy",
        variant: "destructive",
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
        title: "Downloaded!",
        description: "Word document has been downloaded",
        duration: 2000,
      });
    } else {
      toast({
        title: "Error",
        description: "No flashcards available to download",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
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

      <div className="grid gap-4">
        {flashcards.length > 0 ? (
          flashcards.map((card) => (
            <Card key={card.id}>
              <CardContent className="flex items-center justify-between p-6">
                <div className="grid grid-cols-2 gap-8 flex-1">
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground mb-1">
                      Answer
                    </p>
                    <p className="text-lg">{card.answer}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground mb-1">
                      Question
                    </p>
                    <p className="text-lg">{card.question}</p>
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyFlashcard(card)}
                        className="flex-shrink-0 ml-4"
                      >
                        <FontAwesomeIcon
                          icon={faClipboard}
                          className="h-4 w-4"
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy to clipboard</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
