import React, { useState, FormEvent, useEffect } from "react";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";

import api from "../../services/api";

import "./styles.css";

interface MessagesProps {
  username: string;
  message: string;
}

const socket = io("http://localhost:3333");

function ChatPage() {
  const history = useHistory();

  const username = localStorage.getItem("username") || "username";
  const [userLevel, setUserLevel] = useState("");

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessagesProps[]>([]);

  useEffect(() => {
    async function conection() {
      const token = localStorage.getItem("token");

      try {
        const response = await api.get("chats", {
          headers: {
            Authorization: token,
          },
        });

        return response.data;
      } catch (error) {
        history.push("/");
      }
    }

    conection().then((response) => {
      setUserLevel(response.userLevel);
    });
  }, [history]);

  useEffect(() => {
    function handleNewMessage(newMessage: MessagesProps) {
      // messages.push(newMessage);
      // setMessages([...messages]);
      setMessages([...messages, newMessage]);
    }

    // socket.on("previousMessages", (previousMessages: MessagesProps[]) => {
    //   console.log(previousMessages);
    //   previousMessages.map((item) => handleNewMessage(item));
    // });

    // socket.on("sendMessage", (newMessage: MessagesProps) => {
    //   handleNewMessage(newMessage);
    // }); //se inscreve no canal sendMessage

    // return () => {
    //   //se desinscreve do canal sendMessage
    //   socket.off("sendMessage", (newMessage: MessagesProps) => {
    //     handleNewMessage(newMessage);
    //   });
    // };
  }, [messages]);

  function handleLogout() {
    localStorage.removeItem("username");
    localStorage.removeItem("token");

    history.push("/");
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (message !== "") {
      console.log(userLevel, message);
      socket.emit("sendMessage", { username, message });
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
        <input
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
