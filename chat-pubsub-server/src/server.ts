import express from "express";
import cors from "cors";
import routes from "./routes";

import { createServer } from "http";
import socketIo from "socket.io";

const app = express();

const server = createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());
app.use(routes);

////////////////////////////////////////////////////
let message = []; // sem uso no momento

io.on("connection", (socket) => {
  console.log(`Socket conectado: ${socket.id}`);

  //escuta o canal sendMessage e emite para todos pelo io.on
  socket.on("sendMessage", (data) => {
    console.log("sendMessage:", data);
    message.push(data);
    io.emit("sendMessage", data);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnect: ${socket.id}`);
  });
});

// - socket.on: ouvir
// - socket.emit: enviar mensagem unicamente para o socket conectado
// - socket.broadcast.emit: enviar mensagem para todos os sockets conectados
///////////////////////////////////////////////////

server.listen(3333);
