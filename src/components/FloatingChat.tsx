// src/components/FloatingChat.tsx
import { useState } from "react";
import Chatbot from "./Chatbot";
import { MessageCircle } from "lucide-react";

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "24px",
            zIndex: 9999,
            width: "360px",
            height: "500px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            borderRadius: "12px",
            overflow: "hidden",
            backgroundColor: "#fff",
          }}
        >
          <Chatbot />
        </div>
      )}

      {/* Tooltip */}
      {!isOpen && hovered && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "96px",
            backgroundColor: "#1b3b6f",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: "8px",
            fontSize: "0.9rem",
            whiteSpace: "nowrap",
            zIndex: 9999,
          }}
        >
          Ask Azalea 🌸
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: hovered ? "#14315a" : "#1b3b6f",
          color: "#fff",
          fontSize: "24px",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          transition: "background-color 0.3s ease",
          animation: !isOpen ? "pulse 2s infinite" : "none", // ✨ Pulse if not open
        }}
      >
        {isOpen ? "×" : <MessageCircle />}
      </button>

      {/* 🔄 Keyframes for pulsing */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(27, 59, 111, 0.4); }
            70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(27, 59, 111, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(27, 59, 111, 0); }
          }
        `}
      </style>
    </div>
  );
}
