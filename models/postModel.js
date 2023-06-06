const mongoose = require("mongoose");

const schema = mongoose.Schema({
  user: { type: mongoose.ObjectId, ref: "User" },
  text: String,
  image: String,
  createdAt: Date,
  likes: [{ type: mongoose.ObjectId, ref: "User" }],
  comments: [
    {
      user: { type: mongoose.ObjectId, ref: "User" },
      text: String,
      createdAt: Date,
    },
  ],
});

const PostModel = mongoose.model("Post", schema);

module.exports = {
  PostModel,
};
