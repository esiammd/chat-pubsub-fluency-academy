import express from "express";
import UsersController from "./controllers/UsersController";
import SessionsController from "./controllers/SessionsController";
import ChannelsController from "./controllers/ChannelsController";

const routes = express.Router();
const usersController = new UsersController();
const sessionsController = new SessionsController();
const channelsController = new ChannelsController();

routes.post("/users", usersController.create);

routes.post("/sessions", sessionsController.create);

routes.get("/channels", channelsController.index);

export default routes;
