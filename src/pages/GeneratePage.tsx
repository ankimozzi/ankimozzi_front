import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateUploadURL, checkDeckStatus } from "../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import loading1 from "../assets/loading_1.svg";
import loading2 from "../assets/loading_2.svg";
import loading3 from "../assets/loading_3.svg";

const GeneratePage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [deckName, setDeckName] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [polling, setPolling] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [imageIndex, setImageIndex] = useState<number>(0);
  const navigate = useNavigate();

  const images = [loading1, loading2, loading3];

  useEffect(() => {
    let imageInterval: NodeJS.Timeout;
    if (isModalOpen && !isError) {
      imageInterval = setInterval(() => {
        setImageIndex((prev) => (prev + 1) % images.length);
      }, 300);
    }
    return () => clearInterval(imageInterval);
  }, [isModalOpen, isError]);

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

  const pollForDeckCompletion = async (deckName: string) => {
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      try {
        const response = await checkDeckStatus(deckName);
        console.log(`Polling attempt ${attempts}`, response);

        if (response && response.status === "complete") {
          return response;
        }

        await new Promise((resolve) => setTimeout(resolve, 3000));
        attempts++;
      } catch (error) {
        console.error("Error polling for deck completion:", error);
        break;
      }
    }

    throw new Error(
      "Failed to retrieve completed deck after multiple attempts"
    );
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
      console.log("Upload URL:", uploadUrl);

      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      setPolling(true);

      const deckResponse = await pollForDeckCompletion(deckName);
      setPolling(false);

      setIsModalOpen(false);
      navigate(`/flashcards/${deckName}`, {
        state: {
          deckResponse,
        },
      });
    } catch (error) {
      console.error("Error during file upload or deck generation:", error);
      setUploadStatus(
        "An error occurred during the process. Please try again."
      );
      setPolling(false);
      setIsError(true);
    }
  };

  return (
    <div className="font-inter p-5">
      <h1 className="text-2xl font-bold mb-5">Generate Flashcard from Video</h1>

      <div className="mx-[180px] my-20">
        <div
          className={`
          rounded-xl bg-white border-2 border-dashed border-[#edeff5] 
          p-8 text-center transition-all cursor-pointer
          ${polling ? "bg-[#edeff5] border-[#edeff5]" : ""}
        `}
        >
          {!file ? (
            <>
              <p className="text-base font-medium text-[#1a1a1a] mb-2">
                Upload your lecture video or audio
              </p>
              <p className="text-sm text-[#666666] mb-4">
                Supported formats: .mp4, .wav, .mp3, .flac, .ogg
              </p>
              <label
                className="
                inline-block px-4 py-2 rounded-xl bg-white 
                border-2 border-[#edeff5] text-[#1a1a1a] 
                text-sm font-medium cursor-pointer 
                transition-all hover:bg-[#edeff5]
              "
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".mp4,.wav,.mp3,.flac,.ogg"
                  className="hidden"
                />
                Browse files
              </label>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div
                className="
                w-12 h-12 bg-[#f0f0f0] flex items-center justify-center 
                rounded-xl text-2xl text-[#666666] flex-shrink-0
              "
              >
                <FontAwesomeIcon icon={faFile} />
              </div>
              <span className="flex-1 text-sm font-semibold text-[#1a1a1a] text-left">
                {file.name}
              </span>
              <span className="text-sm text-[#666666]">
                {(file.size / (1024 * 1024)).toFixed(1)} MB
              </span>
              <button
                className="p-1 text-[#666666] hover:text-[#ff4444]"
                onClick={handleRemoveFile}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mx-[180px] my-6">
        <label className="block text-base font-semibold mb-4 text-[#1a1a1a]">
          Deck Name
          <span className="text-[#F83446]">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter deck name"
          value={deckName}
          onChange={handleDeckNameChange}
          className={`
            w-full p-4 text-base border-2 border-[#edeff5] 
            rounded-xl bg-white transition-all box-border
            focus:outline-none focus:border-[#007aff]
            ${!file ? "bg-[#f5f5f5] cursor-not-allowed" : ""}
          `}
          disabled={!file}
        />
      </div>

      <div className="flex justify-end mx-[180px] my-6">
        <button
          className={`
            px-6 py-3 rounded-xl bg-[#4255ff] text-white 
            border-none text-base font-medium cursor-pointer 
            transition-all hover:opacity-90
            disabled:bg-[#a0aaff] disabled:cursor-not-allowed
          `}
          onClick={handleGenerate}
          disabled={!file || !deckName.trim() || polling}
        >
          {polling ? "Generating..." : "Generate"}
        </button>
      </div>

      {uploadStatus && <p className="text-center">{uploadStatus}</p>}

      {/* Modal */}
      {isModalOpen && (
        <div
          className="
          fixed inset-0 bg-black/60 
          flex justify-center items-center z-50
        "
        >
          <div
            className="
            flex flex-col items-center justify-center text-center 
            p-8 bg-white rounded-xl shadow-lg
          "
          >
            {isError ? (
              <>
                <h2 className="text-2xl text-[#333] mb-2">Error Occurred</h2>
                <p className="text-base text-[#666]">
                  An error occurred during the process. Please try again.
                </p>
                <button
                  className="
                    mt-4 px-6 py-3 rounded-xl bg-[#4255ff] 
                    text-white border-none text-base font-medium 
                    cursor-pointer transition-all hover:opacity-90
                  "
                  onClick={handleModalClose}
                >
                  Go Back
                </button>
              </>
            ) : (
              <>
                <img
                  src={images[imageIndex]}
                  alt={`Loading animation ${imageIndex + 1}`}
                  className="w-[100px] mb-5 transition-opacity duration-300 opacity-100"
                />
                <h2 className="text-2xl text-[#4255ff] mb-2">
                  Generating your flashcard set...
                </h2>
                <p className="text-base text-[#666]">
                  This may take a while depending on the size of your upload
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratePage;
