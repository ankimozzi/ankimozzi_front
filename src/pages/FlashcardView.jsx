import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "../styles/FlashcardView.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-solid-svg-icons"; // Clipboard icon

const FlashcardView = () => {
  const { deckId } = useParams(); // Get deckId from URL
  const location = useLocation(); // Get state passed from GeneratePage
  const { deckResponse } = location.state || {}; // Destructure the passed state
  const [flashcards, setFlashcards] = useState([]);

  useEffect(() => {
    console.log("Deck Response:", deckResponse);
    if (deckResponse?.data) {
      try {
        const parsedFlashcards = deckResponse.data
          .split("\n") // Split by newline
          .filter((line) => line.trim()) // Remove empty lines
          .map((line, index) => {
            const [answer, question] = line
              .split("\t")
              .map((part) => part.trim());
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

  const handleCopyFlashcard = (card) => {
    navigator.clipboard.writeText(`${card.answer}    ${card.question}`);
    alert("Flashcard copied to clipboard!");
  };

  const handleCopyAllJSON = () => {
    if (deckResponse?.data) {
      navigator.clipboard.writeText(deckResponse.data);
      alert("All flashcards copied for Quizlet!");
    } else {
      alert("No data available to copy.");
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
      URL.revokeObjectURL(url); // Clean up object URL
    } else {
      alert("No flashcards available to download.");
    }
  };

  return (
    <div className="flashcard-container">
      <div className="header">
        <h1>Flashcards for {deckId}</h1>
        <div>
          <button className="action-button" onClick={handleCopyAllJSON}>
            Copy All
          </button>
          <button
            className="download-button"
            onClick={handleDownloadWord}
            disabled={flashcards.length === 0}
          >
            Download as Word
          </button>
        </div>
      </div>
      <div>
        {flashcards.length > 0 ? (
          flashcards.map((card) => (
            <div className="flashcard-item" key={card.id}>
              <div className="flashcard-content">
                <p>
                  <strong>Answer:</strong> {card.answer}
                </p>
              </div>
              <div className="flashcard-content">
                <p>
                  <strong>Question:</strong> {card.question}
                </p>
              </div>
              <div
                className="file-icon"
                onClick={() => handleCopyFlashcard(card)}
                title="Copy to clipboard"
              >
                <FontAwesomeIcon icon={faClipboard} />
              </div>
            </div>
          ))
        ) : (
          <p className="loading-message">Loading flashcards...</p>
        )}
      </div>
    </div>
  );
};

export default FlashcardView;
