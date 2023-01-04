import express, { Application } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import "module-alias/register";

import userRouter from "@routers/user.router";
import initRouters from "@utils/initRouters";
import authorizationRouter from "@routers/authorization.router";
import postRouter from "@routers/post.router";

dotenv.config();
mongoose.set("strictQuery", true);

const { PORT, MONGO_USERNAME, MONGO_PASSWORD, MONGO_PORT, MONGO_HOST } =
  process.env;

const mongoURL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`;

mongoose.connect(mongoURL);

const app: Application = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

initRouters(app, [userRouter, authorizationRouter, postRouter]);

app.listen(parseInt(PORT || "5000"), () => {
  console.log(`Server is runniung on port ${PORT}`);
});
