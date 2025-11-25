import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, unique: true, sparse: true },
    profilePic: String,
    coverPic: String,
    status: String,
    otp: String,
    signMethod: {
      type: String,
      enum: ["github", "google", "local"],
      required: true,
    },
    password: {
      type: String,
      required: function () {
        return this.signMethod === "local" && this.status !== "verifying";
      },
    }, // hashed password for local auth
  },
  { timestamps: true }
);

// Prevent model recompilation in dev / hot-reload. This is mainly an issue in Next.js
// but not in express.js because in express server starts once and keeps running so models
//  are created only once. In Next.js, whenever and api route is called or during hot reload
//  the next.jg might recall that file. This means the line `mongoose.model("User", schema)` might
//  run again in the same process. So this says the user model already exists in mongoose then do not overwrite it.

const User = models.User || model("User", userSchema);

export default User;
// in express it would be -> module.exports = User;
