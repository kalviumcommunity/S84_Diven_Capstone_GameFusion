// src/components/MicButton.jsx
import React, { useState, useRef } from "react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const MicButton = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const handleMicClick = () => {
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in your browser.");
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript); // Pass the transcript to the parent
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
    }

    recognitionRef.current.start();
  };

  return (
    <div className="mic-icon" onClick={handleMicClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="currentColor"
        className="bi bi-mic"
        viewBox="0 0 16 16"
      >
        <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5" />
        <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3" />
      </svg>
      {isListening && <span>🎙️ Listening...</span>}
    </div>
  );
};

export default MicButton;
