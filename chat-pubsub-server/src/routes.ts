import express from "express";
import UsersController from "./controllers/UsersController";
import SessionsController from "./controllers/SessionsController";

// import authMiddleware from "./middlewares/auth";

const routes = express.Router();
const usersController = new UsersController();
const sessionsController = new SessionsController();

routes.post("/users", usersController.create);

routes.post("/sessions", sessionsController.create);

// routes.post(
//   "/chats",
//   authMiddleware,
//   chatsController.create
// );

export default routes;
