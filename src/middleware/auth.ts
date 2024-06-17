import { Request, Response, NextFunction } from "express";
import jwt, { decode } from "jsonwebtoken";
import User, { UserType } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: UserType;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    const error = new Error("No autorizado");
    return res.status(401).json({ error: error.message });
  }

  const token = bearer.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (typeof decoded === "object" && decoded.id) {
      const user = await User.findById(decoded.id).select("_id name email");
      if (!user) {
        const error = new Error("Token No Válido");
        return res.status(404).json({ error: error.message });
      }
      req.user = user;
    }
  } catch (error) {
    res.status(500).json({ error: "Token No Válido" });
  }

  next();
};
