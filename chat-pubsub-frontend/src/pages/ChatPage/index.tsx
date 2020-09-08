import React, { useState, FormEvent, useEffect } from "react";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";

import "./styles.css";

interface MessagesProps {
  username: string;
  message: string;
}

function ChatPage() {
  const history = useHistory();

  const username = localStorage.getItem("username") || "username";

  const [socket, setSocket] = useState<SocketIOClient.Socket>();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessagesProps[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      history.push("/");
    }

    const socket = io.connect("http://localhost:3333", {
      query: { token },
    });

    setSocket(socket);
  }, [history]);

  useEffect(() => {
    function handleNewMessage(newMessage: MessagesProps) {
      messages.push(newMessage);
      setMessages([...messages]);
    }

    if (socket) {
      // listen to previous messages
      socket.on("previousMessages", (previousMessages: MessagesProps[]) => {
        previousMessages.map((item) => handleNewMessage(item));
      });

      socket.on("receivedMessage", (newMessage: MessagesProps) => {
        handleNewMessage(newMessage);
      }); //se inscreve no canal sendMessage
    }
  }, [socket, messages]);

  function handleLogout() {
    localStorage.removeItem("username");
    localStorage.removeItem("token");

    history.push("/");
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (message !== "") {
      if (socket) {
        socket.emit("sendMessage", { username, message });
      }
      setMessage("");
    }
  }

  return (
    <div className="page_chat">
      <header>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </header>

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
        <textarea
          placeholder="Enter your message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <button type="submit" className="form_button">
          Submit
        </button>
      </form>
    </div>
  );
}

export default ChatPage;
