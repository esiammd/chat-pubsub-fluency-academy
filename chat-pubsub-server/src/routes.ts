import express from "express";
import UsersController from "./controllers/UsersController";
import SessionsController from "./controllers/SessionsController";

const routes = express.Router();
const usersController = new UsersController();
const sessionsController = new SessionsController();

routes.post("/users", usersController.create);
routes.get("/users", usersController.index);

routes.post("/sessions", sessionsController.create);

export default routes;
