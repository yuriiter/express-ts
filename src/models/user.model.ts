import { model, Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["ADMIN", "USER"],
    requied: true,
  },
  signUpDate: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
  posts: {
    type: [Schema.Types.ObjectId],
    ref: "Post",
    default: [],
  },
});

const User = model("User", userSchema);

export default User;
