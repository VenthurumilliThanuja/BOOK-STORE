import { useState } from "react";
import api from "../services/api.js";

const starterMessages = [
  {
    sender: "bot",
    text: "Hi! I am your BookStore assistant. Ask me for book recommendations, cart help, checkout steps, login help, or admin guidance."
  }
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(starterMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (event) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setMessages((current) => [...current, { sender: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/chat", { message: text });
      setMessages((current) => [...current, { sender: "bot", text: data.reply }]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          sender: "bot",
          text: error.response?.data?.message || "I could not answer right now. Please check whether the backend is running."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot">
      {open && (
        <section className="chatbot-panel" aria-label="BookStore AI chatbot">
          <div className="chatbot-header">
            <div>
              <span>AI Assistant</span>
              <strong>BookStore Guide</strong>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chatbot">x</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div className={`chat-message ${message.sender}`} key={`${message.sender}-${index}`}>
                {message.text.split("\n").map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            ))}
            {loading && <div className="chat-message bot"><p>Typing...</p></div>}
          </div>
          <div className="chatbot-suggestions">
            {["Recommend books", "How checkout works?", "Admin help"].map((text) => (
              <button type="button" key={text} onClick={() => setInput(text)}>{text}</button>
            ))}
          </div>
          <form className="chatbot-form" onSubmit={sendMessage}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about books..."
              aria-label="Chat message"
            />
            <button type="submit" disabled={loading}>Send</button>
          </form>
        </section>
      )}
      <button className="chatbot-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-label="Open AI chatbot">
        {open ? "Close" : "AI-Chat"}
      </button>
    </div>
  );
}
