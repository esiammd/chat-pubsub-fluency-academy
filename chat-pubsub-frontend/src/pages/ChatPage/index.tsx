import React, { useState, FormEvent, useEffect } from "react";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";

import api from "../../services/api";

import "./styles.css";

interface MessagesProps {
  username: string;
  message: string;
}

interface ChannelsProps {
  channel: string;
}

function ChatPage() {
  const history = useHistory();
  const [socket, setSocket] = useState<SocketIOClient.Socket>();

  const username = localStorage.getItem("username") || "username";
  const [userChannels, setUserChannels] = useState<string[]>([]);

  const [channels, setChannels] = useState<ChannelsProps[]>([]);
  const [selectedChannel, setSelectedChannel] = useState("D");

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessagesProps[]>([]);

  // connection socket
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

  // setChannels
  useEffect(() => {
    async function handleChannels() {
      try {
        const channels = await api.get("/channels");
        setChannels(channels.data);
      } catch (error) {
        alert("Request failed");
      }
    }
    handleChannels();
  }, []);

  // setUserChannels
  useEffect(() => {
    // listens to user access channels
    socket?.on("userChannels", (userChannels: string[]) => {
      setUserChannels(userChannels);
    });
  }, [socket, userChannels]);

  // listen to previous messages from channel selected
  useEffect(() => {
    socket?.on("previousMessage", (newMessages: MessagesProps[]) => {
      setMessages([...messages, ...newMessages]);
    });
  }, [socket, messages]);

  // listen to received messages from channel selected
  useEffect(() => {
    socket?.on("receivedMessage", (newMessage: MessagesProps) => {
      setMessages([...messages, newMessage]);
    });
  }, [socket, messages]);

  function handleLogout() {
    localStorage.removeItem("username");
    localStorage.removeItem("token");

    socket?.disconnect();
    setSocket(undefined);

    history.push("/");
  }

  function handleChangeChannel(channel: string) {
    socket?.emit("changeChannel", channel);
    setSelectedChannel(channel);
    setMessages([]);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (message !== "") {
      // send the message to the sendMessage channel
      socket?.emit("sendMessage", {
        channel: selectedChannel,
        username,
        message,
      });
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

      <div className="chat">
        <h1>Chat Fluency Academy</h1>

        <div className="channels">
          {channels.map((item, index) => {
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleChangeChannel(item.channel)}
                disabled={!userChannels.includes(item.channel)}
                className={`channel_${
                  item.channel === selectedChannel ? "selected" : "unselected"
                }`}
              >
                Chat {item.channel}
              </button>
            );
          })}
        </div>

        <div className="messages">
          <ul>
            {messages.map((item, index) => {
              return (
                <li
                  key={index}
                  className={`message_${
                    item.username === username ? "mine" : "other"
                  }`}
                >
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
    </div>
  );
}

export default ChatPage;
