import { useState } from "react";
import { responder } from "./bot";
import "./App.css";


function App() {
  const [messages, setMessages] = useState<{ author: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;

    const question = { author: "user" as const, text: input };
    setMessages((prev) => [...prev, question]);
    setInput("");
    setLoading(true);

    try {
      const aiAnswer = await responder(input);
      setMessages((prev) => [...prev, { author: "bot", text: aiAnswer }]);
    } finally {
      setLoading(false);
    }
  };

  const getAvatar = (author: "user" | "bot") =>
    author === "user" ? (
      <div className="avatar" title="You">🧑</div>
    ) : (
      <div className="avatar" title="Bot">🤖</div>
    );

  return (
    <div className="container">
      <div className="chat-box">
        <div className="chat-header">Ask something about Gabriel</div>
        <div className="messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.author}`}>
              {getAvatar(msg.author)}
              <div className="message-content">{msg.text}</div>
            </div>
          ))}
          {loading && (
            <div className="message bot">
              {getAvatar("bot")}
              <div className="message-content">Thinking...</div>
            </div>
          )}
        </div>
        <div className="input-area">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={loading ? "Please wait..." : "Ask anything"}
            aria-label="Ask anything"
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
