import mongoose, { Schema, Types } from "mongoose";

const userSchema = new Schema(
  {
    userId: {
      type: String,
      required: [true, "User Id is required"],
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true }
);

const user = mongoose.model("user", userSchema);
export default user;
