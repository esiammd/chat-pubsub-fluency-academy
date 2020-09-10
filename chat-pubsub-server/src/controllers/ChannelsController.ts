import { Request, Response } from "express";
import db from "../database/connection";

export default class ChannelsController {
  async index(req: Request, res: Response) {
    const channels = await db("channels").select("channel");

    return res.status(201).json(channels);
  }
}
