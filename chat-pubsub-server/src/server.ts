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

io.on("connection", (socket) => {
  console.log(`Socket conectado: ${socket.id}`);

  socket.on("sendMessage", (data) => {
    console.log(data);
  });
});

///////////////////////////////////////////////////

server.listen(3333);
