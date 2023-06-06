const mongoose = require("mongoose");

const schema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  dob: Date,
  bio: String,
  posts: [{ type: mongoose.ObjectId, ref: "Post" }],
  friends: [{ type: mongoose.ObjectId, ref: "User" }],
  friendRequests: [{ type: mongoose.ObjectId, ref: "User" }],
});

const UserModel = mongoose.model("User", schema);

module.exports = {
  UserModel,
};
