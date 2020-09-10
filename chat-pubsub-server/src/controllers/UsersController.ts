import { Request, Response } from "express";
import hashPassword from "../utils/hashPassword";
import db from "../database/connection";

export default class UsersController {
  async create(req: Request, res: Response) {
    const { username, password, channel } = req.body;

    const isUser = await db("users").where("username", username).first();
    if (!isUser) {
      const channel_id = await db("channels")
        .where("channel", channel)
        .select("id")
        .first();

      await db("users").insert({
        username,
        password: await hashPassword(password),
        channel_id: channel_id.id,
      });
    } else {
      return res.status(409).json({
        error: "User already exists",
      });
    }

    return res.status(201).send();
  }
}
