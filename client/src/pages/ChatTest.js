import React, { useState, useEffect } from "react";

const ChatInterface = () => {
  const [value, setValue] = useState(""); // Stores user input
  const [suggestions, setSuggestions] = useState([]); // Stores starting suggestions
  const [dynamicPrompts, setDynamicPrompts] = useState([]); // Stores new prompts from "Keep Prompting"

  // Fetch starting suggestions when the component loads
  useEffect(() => {
    fetchSuggestions();
  }, []);

  // Fetch initial suggestions from the backend
  const fetchSuggestions = async () => {
    try {
      const response = await fetch("http://localhost:5000/suggestions");
      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Fetch new prompts when "Keep Prompting" is clicked
  const fetchNewPrompts = async () => {
    try {
      const response = await fetch("http://localhost:5000/prompting", {
        method: "POST",
        body: JSON.stringify({ currentTextData: value }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      setDynamicPrompts(data.prompts);
    } catch (error) {
      console.error("Error fetching new prompts:", error);
    }
  };

  // Handle clicking a suggestion (auto-fills input)
  const handleSuggestionClick = (suggestion) => {
    setValue(suggestion);
  };

  // Handle finishing journal entry
  const finishEntry = () => {
    setValue("");
    setDynamicPrompts([]);
  };

  return (
    <div className="chat-container">
      {/* Header Section */}
      <div className="header">
        <span className="back-btn">←</span>
        <h1>What's on your mind?</h1>
      </div>


      {/* Input Section with Right-Aligned Buttons */}
      <div className="bottom-section">
        {/* Text Input */}
        <input
            type="text"
            placeholder="Write here..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="chat-input"
        />

        {/* Buttons (Right-Aligned) */}
        <div className="button-container">
            <button className="keep-prompting" onClick={fetchNewPrompts}>
            Keep Prompting
            </button>
            <button className="finish-entry" onClick={finishEntry}>
            Finish Entry
            </button>
        </div>
        </div>
    </div>
  );
};

export default ChatInterface;