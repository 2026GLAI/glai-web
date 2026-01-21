import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [
      ...messages,
      { role: "user", content: text }
    ];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": navigator.language || "en"
        },
        body: JSON.stringify({
          messages: nextMessages
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      if (!data.reply) {
        throw new Error("Invalid API response");
      }

      setMessages([
        ...nextMessages,
        { role: "assistant", content: data.reply }
      ]);
    } catch (err) {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: "Connection error"
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}
    >
      <h1 style={{ textAlign: "center" }}>GLAI</h1>

      <div
        style={{
          border: "1px solid #ccc",
          padding: 16,
          minHeight: 300,
          marginBottom: 12,
          overflowY: "auto"
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <strong>{m.role === "user" ? "You" : "GLAI"}:</strong>{" "}
            {m.content}
          </div>
        ))}

        {loading && <em>GLAI is thinking…</em>}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          style={{ flex: 1, padding: 8 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message"
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}
