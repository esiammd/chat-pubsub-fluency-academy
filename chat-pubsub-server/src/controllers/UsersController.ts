import { Request, Response } from "express";
import hashPassword from "../utils/hashPassword";
import db from "../database/connection";

export default class UsersController {
  async index(req: Request, res: Response) {
    const users = await db("users");

    return res.json(users);
  }
  async create(req: Request, res: Response) {
    const { username, password, level } = req.body;

    const isUser = await db("users").where("username", username).first();
    if (!isUser) {
      await db("users").insert({
        username,
        password: await hashPassword(password),
        level,
      });
    } else {
      return res.status(409).json({
        error: "User already exists",
      });
    }

    return res.status(201).send();
  }
}
