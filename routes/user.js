const { UserModel } = require("../models/userModel");
const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const {auth} = require("../middleware/auth")

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
    let flag = false;
    if (user.length != 0) {
      bcrypt.compare(req.body.password, user[0].password, function (err, res) {
        if (err) throw err;
        flag = true
    });
    setTimeout(()=>{
      if(!flag){
        res
          .status(500)
          .json({ msg: "something went wrong!" });
        return 
      }
      let token = jwt.sign(
        {
          email: user[0].email,
          id: user[0]._id
        },
        process.env.secretKey,
        { expiresIn: "1h" }
      );
      res.status(201).json({ msg: "user logged in!", token: token });
    }, 500)
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
        let fndlist = await UserModel.findById(req.params.id);
        let list = []
        for(let i = 0; i < fndlist.friends.length; i++){
          list.push(await UserModel.findById(fndlist.friends[i]._id))
        }
        res.status(200).json(list)
    } catch (error) {
        console.log(error)
    }
})
userRouter.post("/users/:id/friends", auth, async(req, res)=>{
  let userId = req.query.id;
    try {
        await UserModel.updateOne({_id: userId}, {$push: {friendRequests: req.params.id}})
        res.status(201).json({"msg": "friend request send to user"})
    } catch (error) {
        console.log(error)
    }
})

userRouter.patch("/users/:id/friends/:friendId", auth, async(req, res)=>{
  try {
    await UserModel.updateOne({_id: req.params.id}, {$pull: {friendRequests: req.params.friendId}});
    if(req.body.isAccept){
      await UserModel.updateOne({_id: req.params.id}, {$push: {friends: req.params.friendId}});
      res.status(204).send("friend request accepted")
    }else{
      res.status(204).json({"msg": "friend request rejected"})
    }
    
  } catch (error) {
    console.log(error)
  }
})

module.exports = {
  userRouter,
};
