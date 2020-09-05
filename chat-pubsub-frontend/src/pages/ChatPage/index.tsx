import React, { useState, FormEvent, useEffect } from "react";

import "./styles.css";

interface MessagesProps {
  user: string;
  message: string;
}

function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<MessagesProps>>([]);

  useEffect(() => {
    setMessages([
      {
        user: "Ana",
        message: "Hello people",
      },
      {
        user: "Carlos",
        message: "Good Morning",
      },
      {
        user: "Luana",
        message: "How are you?",
      },
    ]);
  }, []);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (message !== "") {
      setMessages([...messages, { user: "Fulano", message }]);
      setMessage("");
    }
  }

  return (
    <div className="page_chat">
      <h1>Chat Fluency Academy</h1>

      <div className="messages">
        <ul>
          {messages.map((item, index) => {
            return (
              <li key={index}>
                <span>{item.user}</span>
                <p>{item.message}</p>
              </li>
            );
          })}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="form_chat">
        <input
          placeholder="Enter your message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="form_field"
        />
        <button type="submit" className="form_button">
          Submit
        </button>
      </form>
    </div>
  );
}

export default ChatPage;
