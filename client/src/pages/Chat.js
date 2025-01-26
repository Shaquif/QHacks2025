import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ChatInterface = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [sessionData, setSessionData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showKeepPrompting, setShowKeepPrompting] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    fetchInitialPrompts();
  }, []);

  const fetchInitialPrompts = async () => {
    try {
      const response = await fetch("http://localhost:5000/start_conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data?.startingPrompts?.entry && Array.isArray(data.startingPrompts.entry)) {
        setSuggestions([...data.startingPrompts.entry]);
      } else {
        console.error("Invalid API response structure", data);
      }
    } catch (error) {
      console.error("Error fetching initial prompts:", error);
    }
  };

  const handleSendMessage = () => {
    if (!value.trim()) return;

    const userMessage = { text: value, sender: "User" };
    setSessionData((prevSessionData) => [...prevSessionData, value]);
    setMessages((prev) => [...prev, userMessage]);
    setValue("");
    setShowSuggestions(false);

    if (!showKeepPrompting) {
      setShowKeepPrompting(true);
    }
  };

  const handleKeepPrompting = async () => {
    console.log("📢 'Keep Prompting' button clicked!");

    if (value.trim()) {
      handleSendMessage();
    }

    setIsTyping(true); // Show typing animation

    try {
      const updatedSession = sessionData.join(" ");

      const response = await fetch("http://localhost:5000/keep_prompting", {
        method: "POST",
        body: JSON.stringify({ currentTextData: updatedSession }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.prompts && Array.isArray(data.prompts)) {
        // Simulate delay for typing effect
        setTimeout(() => {
          const newMessages = data.prompts.slice(0, 3).map(prompt => ({
            text: prompt,
            sender: "AI"
          }));

          setMessages((prev) => [...prev, ...newMessages]); // Append messages separately
          setIsTyping(false); // Hide typing indicator
        }, 1000); // Delay to simulate AI thinking time
      } else {
        console.error("Invalid AI response:", data);
        setIsTyping(false);
      }
    } catch (error) {
      console.error("Error fetching more prompts:", error);
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBackClick = () => {
    navigate("/entries");
  };

  const handleSaveJournal = async () => {
    if (value.trim()) {
      handleSendMessage(); // Submit input field content first
    }

    try {
      const response = await fetch("http://localhost:5000/save_journal", {
        method: "POST",
        body: JSON.stringify({ conversationData: sessionData }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error saving journal:", error);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSelectedSuggestion(suggestion); // Highlight clicked suggestion
  };

  return (
    <div className="chat-container">
      {/* Header Section */}
      <div className="header">
        <span className="back-btn" onClick={handleBackClick}>←</span>
        <h1>What's on your mind?</h1>
      </div>

      {/* Starting Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions">
          <p className="suggestion-title">Starting Suggestions:</p>
          {suggestions.map((suggestion, index) => (
            <div 
              key={index} 
              className={`suggestion ${selectedSuggestion === suggestion ? "selected" : ""}`} 
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}

      {/* Chat Messages */}
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isTyping && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="bottom-section">
        <input
          type="text"
          placeholder="Press enter to submit entry into chat:"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="chat-input"
        />

        {/* Buttons Aligned Bottom-Right */}
        <div className="chat-button-container">
          {showKeepPrompting && (
            <button className="keep-prompting" onClick={handleKeepPrompting}>
              Keep Prompting
            </button>
          )}
          <button className="save-journal" onClick={handleSaveJournal}>
            Save Journal
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;