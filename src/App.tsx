import { useState, useEffect } from "react";
import "./App.css";
import FloatingChat from "./components/FloatingChat";

function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.body.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="App">
      <div style={{ textAlign: "right", padding: "1rem" }}>
        <button onClick={() => setDark(!dark)}>
          {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
      <h1 style={{ textAlign: "center", marginTop: "1rem", color: "var(--heading)" }}>
        Welcome to BAU 🎓
      </h1>
      <p style={{ textAlign: "center", color: "var(--subtext)" }}>
        I'm Azalea 🌸 Your Campus & Study Guide! I'm here to assist with everything from academic queries to navigating campus life. Need help with assignments, school policies, or directions? Azalea has the answers to make your school experience smoother!🌿✨
      </p>
      <FloatingChat />
    </div>
  );
}

export default App;
