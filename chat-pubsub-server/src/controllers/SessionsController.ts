import { Request, Response } from "express";

import verifyPassword from "../utils/verifyPassword";
import generateToken from "../utils/generateToken";

import db from "../database/connection";

export default class SessionsController {
  async create(req: Request, res: Response) {
    const { username, password } = req.body;

    const user = await db("users")
      .where("username", username)
      .select("id", "password", "level")
      .first();

    if (!user || !(await verifyPassword(user.password, password))) {
      return res.status(401).json({ error: "Incorrect username or password" });
    }

    return res
      .status(201)
      .json({ token: generateToken({ id: user.id }), level: user.level });
  }
}
