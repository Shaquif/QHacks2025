import React, { useState, useEffect } from "react";

const ChatInterface = () => {
  const [value, setValue] = useState(""); // Stores user input
  const [messages, setMessages] = useState([]); // Stores chat messages
  const [sessionData, setSessionData] = useState([]); // Stores conversation history
  const [suggestions, setSuggestions] = useState([]); // Stores initial prompts
  const [showSuggestions, setShowSuggestions] = useState(true); // Controls visibility of suggestions
  const [showKeepPrompting, setShowKeepPrompting] = useState(false); // Controls visibility of "Keep Prompting"

  // Fetch initial prompts when the page loads
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

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!value.trim()) return;

    const userMessage = { text: value, sender: "User" };
    setSessionData([...sessionData, value]);
    setMessages((prev) => [...prev, userMessage]);
    setValue("");
    setShowSuggestions(false);
    
    // ✅ Ensure "Keep Prompting" button appears after the first message
    if (!showKeepPrompting) {
      console.log("✅ First message sent. Showing 'Keep Prompting' button...");
      setShowKeepPrompting(true);
    }

    try {
      const response = await fetch("http://localhost:5000/keep_prompting", {
        method: "POST",
        body: JSON.stringify({ currentTextData: sessionData.join(" ") }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      const aiResponse = { text: data.prompts.join("\n"), sender: "AI" };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  // Handle "Keep Prompting" button click
  const handleKeepPrompting = async () => {
    console.log("📢 'Keep Prompting' button clicked!");

    try {
      const response = await fetch("http://localhost:5000/keep_prompting", {
        method: "POST",
        body: JSON.stringify({ currentTextData: sessionData.join(" ") }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      const aiResponse = { text: data.prompts.join("\n"), sender: "AI" };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error fetching more prompts:", error);
    }
  };

  // Handle pressing Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle clicking a suggestion
  const handleSuggestionClick = (suggestion) => {
    setValue(suggestion);
  };

  // Save the journal log
  const handleSaveJournal = async () => {
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

  return (
    <div className="chat-container">
      {/* Header Section */}
      <div className="header">
        <span className="back-btn">←</span>
        <h1>What's on your mind?</h1>
      </div>

      {/* Starting Suggestions (Hidden after first message) */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions">
          <p className="suggestion-title">Starting Suggestions:</p>
          {suggestions.map((suggestion, index) => (
            <div key={index} className="suggestion" onClick={() => handleSuggestionClick(suggestion)}>
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
      </div>

      {/* Input Section */}
      <div className="bottom-section">
        <input
          type="text"
          placeholder="Write here..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="chat-input"
        />
        <button className="save-journal" onClick={handleSaveJournal}>
          Save Journal
        </button>
      </div>

      {/* "Keep Prompting" Button */}
      {showKeepPrompting && (
        <div className="keep-prompting-container">
          <button className="keep-prompting" onClick={handleKeepPrompting}>
            Keep Prompting
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;