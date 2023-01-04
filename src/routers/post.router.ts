import { NextFunction, Request, Response, Router } from "express";
import User from "@models/user.model";
import Post from "@models/post.model";

import bodyValidation from "@middleware/bodyValidation.middleware";
import PostDto from "@dto/post.dto";
import authorizationMiddleware from "@middleware/authorization.middleware";

const routerPath = "/posts";
const postRouter = Router();

postRouter.get(
  `${routerPath}/`,
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = Post.find({})
        .then((result) => res.status(200).json(result))
        .catch((err) => res.sendStatus(400));
    } catch (err) {
      return res.sendStatus(500);
    }
  },
);

postRouter.get(`${routerPath}/:id`, (req: Request, res: Response) => {
  try {
    Post.findById(req.params.id).then((result) => {
      return res.status(200).json(result);
    });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

postRouter.put(
  `${routerPath}/:id`,
  bodyValidation(PostDto),
  async (req: Request, res: Response) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post === null) {
        return res.sendStatus(404);
      }
      post.name = req.body.name;
      post.description = req.body.description;
      post.content = req.body.content;

      post.save();
      return res.status(200).json(post);
    } catch (err) {
      return res.sendStatus(500);
    }
  },
);

// Create a post
postRouter.post(
  `${routerPath}`,
  authorizationMiddleware("USER"),
  bodyValidation(PostDto),
  async (req: Request, res: Response) => {
    try {
      const authorId = req.locals.user.sub;
      const user = await User.findById(authorId);
      if (!user) {
        throw "NOT_FOUND";
      }
      const post = new Post({ ...req.body });
      post.save();
      user.posts.push(post._id);
      user.save();
      res.sendStatus(201);
    } catch (err) {
      if (err === "NOT_FOUND") {
        return res.sendStatus(404);
      } else {
        return res.sendStatus(500);
      }
    }
  },
);

// Delete a post
postRouter.delete(
  `${routerPath}/:id`,
  authorizationMiddleware("USER"),
  bodyValidation(PostDto),
  async (req: Request, res: Response) => {
    try {
      const authorId = req.locals.user.sub;
      const postId = req.params.id;

      const user = await User.findById(authorId);
      if (!user) {
        throw "NOT_FOUND";
      }
      user.posts = user.posts.filter((postId) => postId !== postId);
      user.save();

      Post.findByIdAndDelete(postId);
      res.sendStatus(200);
    } catch (err) {
      if (err === "NOT_FOUND") {
        return res.sendStatus(404);
      } else {
        return res.sendStatus(500);
      }
    }
  },
);

export default postRouter;
