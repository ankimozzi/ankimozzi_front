import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import loading1 from "../assets/loading_1.svg";
import loading2 from "../assets/loading_2.svg";
import loading3 from "../assets/loading_3.svg";
import { useUploadUrl, useDeckStatus } from "@/hooks/queries/services";

const GeneratePage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [deckName, setDeckName] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [imageIndex, setImageIndex] = useState<number>(0);
  const navigate = useNavigate();

  const images = [loading1, loading2, loading3];

  // React Query 훅 사용
  const { mutateAsync: generateUploadURL } = useUploadUrl();
  const { data: deckStatus, isLoading: isPolling } = useDeckStatus(deckName);

  useEffect(() => {
    let imageInterval: NodeJS.Timeout;
    if (isModalOpen && !isError) {
      imageInterval = setInterval(() => {
        setImageIndex((prev) => (prev + 1) % images.length);
      }, 300);
    }
    return () => clearInterval(imageInterval);
  }, [isModalOpen, isError]);

  useEffect(() => {
    if (deckStatus?.body) {
      const status = JSON.parse(deckStatus.body).status;
      if (status === "complete") {
        setIsModalOpen(false);
        navigate(`/flashcards/${deckName}`, {
          state: {
            deckResponse: deckStatus,
          },
        });
      }
    }
  }, [deckStatus, deckName, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = [
        "video/mp4",
        "audio/wav",
        "audio/mp3",
        "audio/flac",
        "audio/ogg",
      ];
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        alert("Please upload MP4, WAV, MP3, FLAC, or OGG files only.");
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleDeckNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeckName(e.target.value);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsError(false);
  };

  const handleGenerate = async () => {
    if (!file || !deckName.trim()) {
      alert("Please upload a file and enter a deck name.");
      return;
    }

    try {
      setIsModalOpen(true);
      setIsError(false);

      const uploadUrl = await generateUploadURL({
        fileName: `${deckName}.mp4`,
      });

      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });
    } catch (error) {
      console.error("Error during file upload:", error);
      setIsError(true);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 sm:py-10 sm:px-6 max-w-4xl min-h-[calc(100vh-4rem)]">
      <CardHeader className="px-0 space-y-2">
        <CardTitle className="text-2xl sm:text-3xl font-bold">
          Generate Flashcard from Video
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Upload your video or audio file to create AI-powered flashcards
        </CardDescription>
      </CardHeader>

      <Card className="mt-6 sm:mt-8">
        <CardContent className="pt-4 sm:pt-6">
          <div
            className={`
              rounded-lg border-2 border-dashed
              p-4 sm:p-8 text-center transition-all cursor-pointer
              ${!file ? "hover:border-primary" : ""}
              ${isPolling ? "bg-muted" : ""}
            `}
            onClick={() =>
              !file && document.getElementById("file-upload")?.click()
            }
          >
            {!file ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <h3 className="font-semibold text-sm sm:text-base">
                    Upload your lecture video or audio
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Supported formats: .mp4, .wav, .mp3, .flac, .ogg
                  </p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  accept=".mp4,.wav,.mp3,.flac,.ogg"
                  className="hidden"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-medium truncate text-sm sm:text-base">
                    {file.name}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveFile}
                  className="text-muted-foreground hover:text-destructive h-8 w-8 sm:h-10 sm:w-10"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            )}
          </div>

          <div className="mt-6 sm:mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deck-name" className="text-sm sm:text-base">
                Deck Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="deck-name"
                placeholder="Enter deck name"
                value={deckName}
                onChange={handleDeckNameChange}
                disabled={!file}
                className="text-sm sm:text-base h-9 sm:h-10"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={handleGenerate}
                disabled={!file || !deckName.trim() || isPolling}
                className="w-full sm:w-auto text-sm sm:text-base h-9 sm:h-10"
              >
                {isPolling ? "Generating..." : "Generate"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md mx-4 sm:mx-auto">
          {isError ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">
                  Error Occurred
                </DialogTitle>
                <DialogDescription className="text-sm sm:text-base">
                  An error occurred during the process. Please try again.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end">
                <Button
                  onClick={handleModalClose}
                  className="text-sm sm:text-base h-9 sm:h-10"
                >
                  Go Back
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center space-y-4">
                <img
                  src={images[imageIndex]}
                  alt={`Loading animation ${imageIndex + 1}`}
                  className="w-20 sm:w-24 transition-opacity duration-300"
                />
                <DialogHeader>
                  <DialogTitle className="text-center text-primary text-lg sm:text-xl">
                    Generating your flashcard set...
                  </DialogTitle>
                  <DialogDescription className="text-center text-sm sm:text-base">
                    This may take a while depending on the size of your upload
                  </DialogDescription>
                </DialogHeader>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GeneratePage;
