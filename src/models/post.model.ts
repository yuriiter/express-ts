import { model, Schema } from "mongoose";
import User from "./user.model";

const postSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    default: () => new Date(),
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Post = model("Post", postSchema);

export default Post;
