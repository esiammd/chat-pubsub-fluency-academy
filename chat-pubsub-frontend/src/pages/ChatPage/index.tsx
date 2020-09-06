import React, { useState, FormEvent, useEffect } from "react";
import io from "socket.io-client";

import "./styles.css";
import { useHistory } from "react-router-dom";

interface MessagesProps {
  username: string;
  message: string;
}

const socket = io("http://localhost:3333");

function ChatPage() {
  const history = useHistory();
  const username = localStorage.getItem("username") || "username";

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<MessagesProps>>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      history.push("/");
    }
  }, []);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (message !== "") {
      socket.emit("sendMessage", { username, message });

      setMessages([...messages, { username, message }]);
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
                <span>{item.username}</span>
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
