import jwt from "jsonwebtoken";
import authConfig from "../config/auth";
import { NextFunction } from "express";

function verifyToken(token: string, socket: any, next: NextFunction) {
  const { secret } = authConfig.jwt;

  if (!token) {
    next(new Error("Token not provided"));
  }

  jwt.verify(token, secret, (error: any, decoded: any) => {
    if (error) {
      return next(new Error("Token invalid"));
    }
    socket.decoded = decoded.channel;
    next();
  });
}

export default verifyToken;
