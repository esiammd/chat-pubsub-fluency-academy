import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import authConfig from "../config/auth";

interface Decoded {
  id: number;
  level: string;
}

function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;

  const { secret } = authConfig.jwt;

  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  jwt.verify(token, secret, (error, decoded) => {
    if (error) {
      return res.status(401).json({ error: "Token invalid" });
    }

    const result = decoded as Decoded;

    req.userId = result.id;
    req.userLevel = result.level;

    return next();
  });
}

export default verifyToken;
