import React, { useState, useRef, useEffect } from "react";
import "./micButton.css";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const MicButton = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore errors during cleanup
        }
      }
    };
  }, []);

  const handleMicClick = () => {
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in your browser.");
      return;
    }

    if (isListening) {
      // Stop listening if already active
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
    }

    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error('Error starting recognition:', err);
    }
  };

  return (
    <div className="mic-icon" onClick={handleMicClick} title={isListening ? "Stop listening" : "Start voice search"}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="currentColor"
        className={`bi bi-mic ${isListening ? 'listening' : ''}`}
        viewBox="0 0 16 16"
        aria-label={isListening ? "Listening..." : "Voice search"}
      >
        <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5" />
        <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3" />
      </svg>
      {isListening && <span className="listening-indicator">🎙️ Listening...</span>}
    </div>
  );
};

export default MicButton;
