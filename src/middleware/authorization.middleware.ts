import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

import User from "@models/user.model";
import DecodedUser from "@interfaces/decodedUser.interface";

const authorizationMiddleware = (role: "ADMIN" | "USER" | null) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.cookies.authorization_token;
    if (!token) {
      return res.sendStatus(401);
    }
    const JWT_SECRET: string = process.env.JWT_SECRET as string;

    const decoded: jwt.JwtPayload = jwt.verify(
      token,
      JWT_SECRET,
    ) as jwt.JwtPayload;

    if (!decoded) {
      return res.sendStatus(401);
    }

    const user = await User.findById(decoded.sub);
    if (!user || (role && user.role !== role)) {
      return res.sendStatus(401);
    }

    const decodedUser: DecodedUser = {
      sub: user.id,
      email: user.email as string,
      role: user.role as "ADMIN" | "USER",
    };

    req.locals.user = decodedUser;

    next();
  };
};

export default authorizationMiddleware;
