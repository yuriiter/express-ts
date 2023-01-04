import { NextFunction, Request, Response, Router } from "express";
import User from "@models/user.model";

import bodyValidation from "@middleware/bodyValidation.middleware";
import SignUpDto from "@dto/signUp.dto";

const routerPath = "/users";
const userRouter = Router();

userRouter.get(
  `${routerPath}/`,
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = User.find({}, { passwordHash: 0 })
        .then((result) => res.status(200).json(result))
        .catch((err) => res.sendStatus(400));
    } catch (err) {
      console.log("Error: " + err);
      return res.sendStatus(500);
    }
  },
);

userRouter.get(`${routerPath}/:id`, (req: Request, res: Response) => {
  try {
    User.findById(req.params.id, { passwordHash: 0 }).then((result) => {
      return res.status(200).json(result);
    });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

userRouter.put(
  `${routerPath}/:id`,
  bodyValidation(SignUpDto),
  async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.params.id, { passwordHash: 0 });
      if (user === null) {
        return res.sendStatus(404);
      }
      user.name = req.body.name;
      user.email = req.body.email;

      user.save();
      return res.status(200).json(user);
    } catch (err) {
      return res.sendStatus(500);
    }
  },
);

// Get user's posts
userRouter.get(`${routerPath}/:id/posts`, (req: Request, res: Response) => {
  try {
    User.findById(req.params.id, { passwordHash: 0 })
      .populate("Post")
      .then((result) => {
        return res.status(200).json(result?.posts || []);
      });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

export default userRouter;
