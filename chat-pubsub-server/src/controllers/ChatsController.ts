import { Request, Response } from "express";

export default class ChatsController {
  async index(req: Request, res: Response) {
    return res.json({ userId: req.userId, userLavel: req.userLevel });
  }
}
