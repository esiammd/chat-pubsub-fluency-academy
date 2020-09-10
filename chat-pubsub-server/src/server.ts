import express from "express";
import cors from "cors";
import routes from "./routes";

import { createServer } from "http";
import socketIo from "socket.io";

import verifyToken from "../src/utils/verifyToken";
import db from "./database/connection";

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

// socket.io
interface MessagesProps {
  channel: string;
  username: string;
  message: string;
}

async function saveMessage(message: MessagesProps) {
  await db("messages").insert(message);
}

async function retrieveMessages(channel: string) {
  const response = await db("messages")
    .where("channel", channel)
    .select("username", "message");
  return response;
}

const server = createServer(app);
const io = socketIo(server);

io.use((socket, next) => {
  const token = socket.handshake.query.token;

  verifyToken(token, socket, next);
}).on("connection", (socket: any) => {
  // passes the channels to the customer that he has access to
  if (socket.decoded === "D") {
    socket.emit("userChannels", ["D"]);
  }
  if (socket.decoded === "C") {
    socket.emit("userChannels", ["C", "D"]);
  }
  if (socket.decoded === "B") {
    socket.emit("userChannels", ["B", "C", "D"]);
  }
  if (socket.decoded === "A") {
    socket.emit("userChannels", ["A", "B", "C", "D"]);
  }

  /**
   * subscribe to channel 'D' (channel selected by default)
   * and send previous messages from channel 'D'
   */
  let selectedChannel = "D";
  socket.join(selectedChannel);
  retrieveMessages(selectedChannel).then((response) => {
    socket.emit("previousMessage", response);
  });

  /**
   * listens to the channel selection change, subscribe
   * to new channel and sends the corresponding previous
   * messages of new channel
   */
  socket.on("changeChannel", (channel: string) => {
    retrieveMessages(channel).then((response) => {
      socket.emit("previousMessage", response);
    });

    if (channel !== selectedChannel) {
      socket.leave(selectedChannel);
      socket.join(channel);
      selectedChannel = channel;
    }
  });

  /**
   * listen to the sendMessage channel,
   * forwards the received message to the corresponding channel and
   * stores the message in the database
   */
  socket.on("sendMessage", (data: MessagesProps) => {
    const { channel, ...newMessage } = data;

    io.sockets.in(channel).emit("receivedMessage", newMessage);
    saveMessage({ channel, ...newMessage });
  });

  socket.on("disconnect", () => {});
});

server.listen(3333);
