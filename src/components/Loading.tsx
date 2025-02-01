import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface LoadingProps {
  message?: string;
  isComplete?: boolean;
}

const Loading = ({
  message = "Loading...",
  isComplete = false,
}: LoadingProps) => {
  const [progress, setProgress] = useState(13);

  useEffect(() => {
    if (isComplete) {
      setProgress(100);
      return;
    }

    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 90) {
          return prevProgress;
        }
        const diff = Math.random() * 2;
        return Math.min(prevProgress + diff, 90);
      });
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, [isComplete]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-8 max-w-sm w-full mx-4 text-center shadow-xl">
        <Progress
          value={progress}
          className={`w-full h-2 transition-all duration-300 ease-out ${
            isComplete ? "bg-muted/20" : ""
          }`}
        />
        <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">
          {message}
        </p>
      </div>
    </div>
  );
};

export default Loading;
