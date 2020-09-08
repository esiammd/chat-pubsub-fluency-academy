import express from "express";
import cors from "cors";
import routes from "./routes";
import verifyToken from "../src/utils/verifyToken";

import { createServer } from "http";
import socketIo from "socket.io";

const app = express();

const server = createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());
app.use(routes);

// socket.io
interface MessagesProps {
  username: string;
  message: string;
}

let messages: MessagesProps[] = []; // sem armazenamento na base de dados no momento

io.use((socket, next) => {
  const token = socket.handshake.query.token;
  verifyToken(token, socket, next);
}).on("connection", (socket: any) => {
  console.log(`Socket conectado: ${socket.id}`);

  // sends previous messages
  socket.emit("previousMessages", messages);

  // escuta o canal sendMessage e emite para todos pelo io.on
  socket.on("sendMessage", (data: any) => {
    console.log("nivel: ", socket.decoded);
    messages.push(data);
    io.emit("receivedMessage", data);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnect: ${socket.id}`);
  });
});

server.listen(3333);
