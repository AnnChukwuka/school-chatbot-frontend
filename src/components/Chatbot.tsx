import React, { useState, useRef, useEffect } from "react";
import Linkify from "react-linkify";
import "./Chatbot.css";
import { User, Bot } from "lucide-react";

type ChatMessage = {
  sender: "user" | "bot";
  text: string;
  image?: string; // Image URL (Optional)
};

const WELCOME_TRIGGER = ["hi", "hello", "hey"];

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef<string>("");

  useEffect(() => {
    const existingSessionId = localStorage.getItem("chatSessionId");
    const generatedSessionId = existingSessionId || crypto.randomUUID();
    localStorage.setItem("chatSessionId", generatedSessionId);
    sessionId.current = generatedSessionId;

    const localMessages = localStorage.getItem("chatMessages");
    if (localMessages) {
      setMessages(JSON.parse(localMessages));
    }
  }, []);

  const saveMessagesToLocalStorage = (messages: ChatMessage[]) => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    saveMessagesToLocalStorage(messages);
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = { sender: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    if (WELCOME_TRIGGER.includes(trimmed.toLowerCase())) {
      setTimeout(() => {
        const text = "Hi!";
        const botMessage: ChatMessage = { sender: "bot", text };
        setMessages((prev) => [...prev, botMessage]);
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({
          message: trimmed,
          session_id: sessionId.current,
          log_to_firebase: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        sender: "bot",
        text: data.text,
        image: data.image, // Attach image URL
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("❌ API call failed:", err);
      const failText = "Sorry, there was an error contacting the server.";
      setMessages((prev) => [...prev, { sender: "bot", text: failText }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    localStorage.removeItem("chatMessages");
    setMessages([]);
  };

  return (
    <div className="chatbot-wrapper" style={{width:"fit"}}>
      <header className="chatbot-header">Azalea 🌸</header>
      <div style={{ textAlign: "right", padding: "0.5rem 1rem" }}>
        <button onClick={handleClearChat} style={{ fontSize: "0.9rem" }}>
          🧹 Clear Chat
        </button>
      </div>
      <div className="chatbot-window">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            {msg.sender === "user" ? <User size={18} /> : <Bot size={18} />}
            <div className="message-text">
              <Linkify>{msg.text}</Linkify>
              {/* 📸 Show Image if it exists */}
              {msg.image && (
              <div style={{ marginTop: "10px" }}>
                <img
                  src={msg.image}
                  alt="Chat Image"
                  style={{ maxWidth: "100%", borderRadius: "10px" }}
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/300x200?text=Image+Not+Available"; // Fallback image
                  }}
                />
              </div>
            )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-message bot typing-dots">
            <Bot size={18} />
            <div className="message-text">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          placeholder="type..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
