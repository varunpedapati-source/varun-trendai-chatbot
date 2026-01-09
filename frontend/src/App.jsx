import React, { useMemo, useState } from "react";

export default function App() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! Ask me anything." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const apiBase = useMemo(() => (import.meta.env.VITE_API_BASE || ""), []);

  async function sendMessage(e) {
    e.preventDefault();
    const msg = input.trim();
    if (!msg || loading) return;

    setMessages((m) => [...m, { role: "user", text: msg }]);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch(`${apiBase}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg })
      });

      const data = await resp.json();
      const reply = data?.response || "No response.";
      setMessages((m) => [...m, { role: "bot", text: reply }]);
    } catch (err) {
      setMessages((m) => [...m, { role: "bot", text: "Error calling backend." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 820, margin: "40px auto", fontFamily: "system-ui" }}>
      <h2>TrendAI Chatbot</h2>

      <div style={{
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 16,
        height: 420,
        overflowY: "auto",
        background: "#fafafa"
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: "10px 0", textAlign: m.role === "user" ? "right" : "left" }}>
            <span style={{
              display: "inline-block",
              padding: "10px 12px",
              borderRadius: 12,
              background: m.role === "user" ? "#dbeafe" : "#fff",
              border: "1px solid #e5e7eb",
              maxWidth: "85%"
            }}>
              {m.text}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: 12, borderRadius: 10, border: "1px solid #ddd" }}
        />
        <button
          disabled={loading}
          style={{ padding: "12px 16px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}
        >
          {loading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}

