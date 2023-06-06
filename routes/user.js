const { UserModel } = require("../models/userModel");
const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

userRouter.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
});

userRouter.post("/register", async (req, res) => {
  try {
    const isExist = await UserModel.find({ email: req.body.email });
    if (isExist.length != 0) {
      res.status(400).json({ msg: "please login as you already registered" });
      return;
    }
    const hash = bcrypt.hashSync("bacon", 5);
    let obj = {
      name: req.body.name,
      email: req.body.email,
      password: hash,
      dob: req.body.dob,
      bio: req.body.bio,
      post: [],
      friends: [],
      friendRequests: [],
    };
    const newUser = new UserModel(obj);
    await newUser.save();
    res.status(201).json({ msg: "user registered!" });
  } catch (error) {
    console.log(error);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const user = await UserModel.find({ email: req.body.email });
    let token;
    if (user.length != 0) {
      bcrypt.compare(req.body.password, user[0].password, function (err, res) {
        if (err) throw err;

        token = jwt.sign(
          {
            email: user[0].email,
          },
          process.env.secretKey,
          { expiresIn: "1h" }
        );
    });
    res.status(201).json({ msg: "user logged in!", token: token });
    } else {
      res
        .status(400)
        .json({ msg: "please register first as you are not registered" });
    }
  } catch (error) {
    console.log(error);
  }
});

userRouter.get("/users/:id/friends", async(req, res)=>{
    try {
        let fndlist = await UserModel.aggregate([{$match: {"_id": req.params.id}}, {$project: {friends: 1}}]);
        res.status(200).json(fndlist)
    } catch (error) {
        console.log(error)
    }
})
userRouter.post("/users/:id/friends", async(req, res)=>{
    try {
        let fndlist = await UserModel.aggregate([{$match: {"_id": req.params.id}}, {$project: {friends: 1}}]);
        res.status(200).json(fndlist)
    } catch (error) {
        console.log(error)
    }
})

module.exports = {
  userRouter,
};
