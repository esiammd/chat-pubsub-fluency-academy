import express, { response } from "express";
import cors from "cors";
import routes from "./routes";

import { createServer } from "http";
import socketIo from "socket.io";

import verifyToken from "../src/utils/verifyToken";
import db from "./database/connection";

const app = express();

const server = createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());
app.use(routes);

// socket.io
interface MessagesProps {
  level: string;
  username: string;
  message: string;
}

async function saveMessage(message: MessagesProps) {
  await db("messages").insert(message);
}

async function retrieveMessages(level: string) {
  const response = await db("messages")
    .where("level", level)
    .select("username", "message");
  return response;
}

io.use((socket, next) => {
  const token = socket.handshake.query.token;
  verifyToken(token, socket, next);
}).on("connection", (socket: any) => {
  console.log(`Socket conectado: ${socket.id}`);

  // passes on to the customer the channel he should listen to
  socket.emit("channel", socket.decoded);

  // sends previous messages
  retrieveMessages(socket.decoded).then((response) => {
    socket.emit("previousMessages", response);
  });

  /**
   * listen to the sendMessage channel,
   * checks the customer’s authorization level,
   * forwards the received message to the corresponding levels
   * */
  socket.on("sendMessage", (data: any) => {
    saveMessage({ level: socket.decoded, ...data });

    switch (socket.decoded) {
      case "D":
        io.emit("D", data);

      case "C":
        io.emit("C", data);

      case "B":
        io.emit("B", data);

      default:
        io.emit("A", data);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnect: ${socket.id}`);
  });
});

server.listen(3333);
