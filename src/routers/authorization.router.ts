import { NextFunction, Request, Response, Router } from "express";
import User from "@models/user.model";
import argon2 from "argon2";
import * as jwt from "jsonwebtoken";

import bodyValidation from "@middleware/bodyValidation.middleware";
import SignUpDto from "@dto/signUp.dto";
import SignInDto from "@dto/signIn.dto";
import authorizationMiddleware from "@middleware/authorization.middleware";

const routerPath = "/authorization";
const authorizationRouter = Router();

// Sign up
authorizationRouter.post(
  `${routerPath}`,
  bodyValidation(SignUpDto),
  async (req: Request, res: Response) => {
    try {
      const passwordHash = await argon2.hash(req.body.password);
      const { name, email, role } = req.body;
      const user = new User({ name, email, role, passwordHash });
      user.save();
      const newUser = { _id: user._id, name: user.name, email: user.email };
      return res.status(200).json(newUser);
    } catch (err) {
      return res.sendStatus(500);
    }
  },
);

// Sign in
authorizationRouter.post(
  `${routerPath}`,
  bodyValidation(SignInDto),
  async (req: Request, res: Response) => {
    try {
      const { email, password, role } = req.body;
      const user = await User.findOne({ email });

      if (!user || user.role !== role) {
        return res.sendStatus(404);
      }

      const { passwordHash } = user;

      const verify = await argon2.verify(passwordHash, password);
      if (!verify) {
        return res.sendStatus(400);
      }

      const authorizationToken = jwt.sign(
        { sub: user._id, email, role },
        process.env.JWT_SECRET as string,
      );
      res.cookie("authorization_token", authorizationToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 2,
      });
      return res.sendStatus(200);
    } catch (err) {
      return res.sendStatus(500);
    }
  },
);

// Is signed in
authorizationRouter.get(
  `${routerPath}/me`,
  authorizationMiddleware(null),
  (req: Request, res: Response) => {
    return res.status(200).json({ user: req.locals.user });
  },
);

export default authorizationRouter;
