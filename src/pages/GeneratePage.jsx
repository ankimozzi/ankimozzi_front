import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateUploadURL, checkDeckStatus } from "../api/api";
import "../styles/Home.css";
import "../styles/GeneratePage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import loading1 from "../assets/loading_1.svg";
import loading2 from "../assets/loading_2.svg";
import loading3 from "../assets/loading_3.svg";

const GeneratePage = () => {
  const [file, setFile] = useState(null);
  const [deckName, setDeckName] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [polling, setPolling] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [isError, setIsError] = useState(false); // Error state for modal
  const [imageIndex, setImageIndex] = useState(0); // Index for cycling images
  const navigate = useNavigate();

  const images = [loading1, loading2, loading3];

  useEffect(() => {
    let imageInterval;

    if (isModalOpen && !isError) {
      // Cycle images every 0.3 seconds
      imageInterval = setInterval(() => {
        setImageIndex((prev) => (prev + 1) % images.length);
      }, 300);
    }

    return () => {
      clearInterval(imageInterval);
    };
  }, [isModalOpen, isError]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
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

  const handleDeckNameChange = (e) => {
    setDeckName(e.target.value);
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Close modal
    setIsError(false); // Reset error state
  };

  const pollForDeckCompletion = async (deckName) => {
    let attempts = 0;
    const maxAttempts = 100; // Poll up to 100 times

    while (attempts < maxAttempts) {
      try {
        const response = await checkDeckStatus(deckName);
        console.log(`Polling attempt ${attempts}`, response);

        if (response && response.status === "complete") {
          return response;
        }

        // Wait 3 seconds before retrying
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
      setIsModalOpen(true); // Open modal
      setIsError(false); // Reset error state

      // Send file and deckName to the server
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

      // Poll for the completion of the deck
      const deckResponse = await pollForDeckCompletion(deckName);
      setPolling(false);

      setIsModalOpen(false); // Close modal
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
      setIsError(true); // Set error state for modal
    }
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Generate Flashcard from Video</h1>

      <div className="file-upload-box">
        {!file ? (
          <>
            <p className="upload-title">Upload your lecture video or audio</p>
            <p className="upload-subtitle">
              Supported formats: .mp4, .wav, .mp3, .flac, .ogg
            </p>
            <label className="browse-files-button">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".mp4,.wav,.mp3,.flac,.ogg"
                className="file-input"
                hidden
              />
              Browse files
            </label>
          </>
        ) : (
          <div className="file-info">
            <div className="file-icon">
              <FontAwesomeIcon icon={faFile} />
            </div>
            <span className="file-name">{file.name}</span>
            <span className="file-size">
              {(file.size / (1024 * 1024)).toFixed(1)} MB
            </span>
            <button className="remove-button" onClick={handleRemoveFile}>
              Remove
            </button>
          </div>
        )}
      </div>

      <div className="input-section">
        <label className="input-label">
          Deck Name
          <span style={{ color: "#F83446" }}>*</span>
        </label>
        <input
          type="text"
          placeholder="Enter deck name"
          value={deckName}
          onChange={handleDeckNameChange}
          className={`home-input ${!file ? "disabled" : ""}`}
          disabled={!file}
        />
      </div>

      <div className="generate-button-container">
        <button
          className={`generate-button ${
            !file || !deckName.trim() ? "disabled" : ""
          }`}
          onClick={handleGenerate}
          disabled={!file || !deckName.trim() || polling}
        >
          {polling ? "Generating..." : "Generate"}
        </button>
      </div>

      {uploadStatus && <p className="status-message">{uploadStatus}</p>}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            {isError ? (
              <>
                <h2>Error Occurred</h2>
                <p>An error occurred during the process. Please try again.</p>
                <button className="generate-button" onClick={handleModalClose}>
                  Go Back
                </button>
              </>
            ) : (
              <>
                <img
                  src={images[imageIndex]}
                  alt={`Loading animation ${imageIndex + 1}`}
                  style={{
                    width: "100px",
                    marginBottom: "20px",
                    transition: "opacity 0.3s ease",
                    opacity: 1,
                  }}
                />
                <h2 style={{ color: "#4255ff" }}>
                  Generating your flashcard set...
                </h2>
                <p>
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
