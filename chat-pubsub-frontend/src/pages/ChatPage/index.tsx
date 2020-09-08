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
  const [channel, setChannel] = useState("");

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
      // messages.push(newMessage);
      // setMessages([...messages]);
      setMessages([...messages, newMessage]);
    }

    // listen to previous messages
    // socket?.on("previousMessages", (previousMessages: MessagesProps[]) => {
    //   previousMessages.map((item) => handleNewMessage(item));
    // });

    // listen to the channel you belong to
    socket?.on("channel", (channel: string) => setChannel(channel));

    // subscribe to the channel you belong to
    socket?.on(channel, (newMessage: MessagesProps) => {
      handleNewMessage(newMessage);
    });
  }, [socket, channel, messages]);

  function handleLogout() {
    localStorage.removeItem("username");
    localStorage.removeItem("token");

    socket?.disconnect();
    setSocket(undefined);

    history.push("/");
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (message !== "") {
      // send the message to the sendMessage channel
      socket?.emit("sendMessage", { username, message });
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
