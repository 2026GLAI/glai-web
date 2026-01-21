import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const nextMessages = [
      ...messages,
      { role: "user", content: input }
    ];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages })
      });

      const data = await res.json();

      if (data?.role && data?.content) {
        setMessages(prev => [...prev, data]);
      } else {
        throw new Error("Invalid response");
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Connection error" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "system-ui" }}>
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
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
