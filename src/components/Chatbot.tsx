import React, { useState, useRef, useEffect } from "react";
import Linkify from "react-linkify";
import "./Chatbot.css";
import { User, Bot } from "lucide-react";
import { saveChatMessage } from "../utils/saveChatMessage";
import { clearChatSession } from "../utils/clearChatSession";
import {
  getDocs,
  collection,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";

type ChatMessage = {
  sender: "user" | "bot";
  text: string;
};

const WELCOME_TRIGGER = ["hi", "hello", "hey"];

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sessionId = useRef<string>("");

  useEffect(() => {
    const existing = localStorage.getItem("chatSessionId");
    const generated = existing || crypto.randomUUID();
    localStorage.setItem("chatSessionId", generated);
    sessionId.current = generated;
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      const ref = collection(db, "chats", sessionId.current, "messages");
      const q = query(ref, orderBy("timestamp"));
      const snapshot = await getDocs(q);
      const history = snapshot.docs.map((doc) => ({
        sender: doc.data().sender,
        text: doc.data().text,
      }));
      setMessages(history as ChatMessage[]);
    };

    loadMessages();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const lower = trimmed.toLowerCase();
    const userMessage: ChatMessage = { sender: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    await saveChatMessage(sessionId.current, trimmed, "user");

    if (WELCOME_TRIGGER.includes(lower)) {
      setTimeout(async () => {
        const text =
          "Hi! I'm Azalea – Your Campus Guide! 🌸";
        const botMessage: ChatMessage = { sender: "bot", text };
        setMessages((prev) => [...prev, botMessage]);
        await saveChatMessage(sessionId.current, text, "bot");
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await response.json();
      const botMessage: ChatMessage = { sender: "bot", text: data.answer };
      setMessages((prev) => [...prev, botMessage]);
      await saveChatMessage(sessionId.current, data.answer, "bot");
    } catch (err) {
      console.error("❌ API call failed:", err);
      const failText = "Sorry, there was an error contacting the server.";
      setMessages((prev) => [...prev, { sender: "bot", text: failText }]);
      await saveChatMessage(sessionId.current, failText, "bot");
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    await clearChatSession(sessionId.current);
    setMessages([]);
  };

  return (
    <div className="chatbot-wrapper">
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
          placeholder="Ask Azalea anything..."
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
