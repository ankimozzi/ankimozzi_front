import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Loading = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      // 상태 확인 로직
      const isComplete = true; // Replace with actual API call
      if (isComplete) {
        navigate(`/flashcards/some-deck-id`);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [navigate]);

  return <h1>Generating flashcards... Please wait.</h1>;
};

export default Loading;
