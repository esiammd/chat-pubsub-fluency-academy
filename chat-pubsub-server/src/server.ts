import express from "express";
import cors from "cors";
import routes from "./routes";

import { createServer } from "http";
import socketIo from "socket.io";
import authMiddleware from "./middlewares/auth";

const app = express();

const server = createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());
app.use(routes);

////////////////////////////////////////////////////
app.get("/chats", authMiddleware, (req, res) => {
  interface MessagesProps {
    username: string;
    message: string;
  }

  let messages: MessagesProps[] = []; // sem armazenamento na base de dados no momento
  io.on("connection", (socket) => {
    console.log(`Socket conectado: ${socket.id}`);

    // socket.emit("previousMessages", messages);

    //escuta o canal sendMessage e emite para todos pelo io.on
    socket.on("sendMessage", (data) => {
      console.log(data);
      messages.push(data);
      io.emit("sendMessage", data);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnect: ${socket.id}`);
    });
  });

  return res.json({ userLevel: req.userLevel });
});
///////////////////////////////////////////////////

server.listen(3333);
