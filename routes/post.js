const { PostModel } = require("../models/postModel");
const express = require("express");
const postRouter = express.Router();
require("dotenv").config();
const {auth} = require("../middleware/auth")

postRouter.get("/posts", async(req, res)=>{
    try {
        let posts = await PostModel.find({});
        res.status(200).json(posts)
    } catch (error) {
        console.log(error)
    }
});

postRouter.post("/posts", auth, async(req, res)=>{
    let userId = req.query.id;
    if(userId != req.body.user){
        return res.status(404).json({"msg": "logged user and post key user should be same"})
    }
    req.body.comments = [];
    req.body.likes = [];
    req.body.createdAt = Date.now()
    try {
        let newPost = new PostModel(req.body);
        await newPost.save();
        res.status(201).json({"msg": "post created!"})
    } catch (error) {
        console.log(error)
    }
})
postRouter.patch("/posts/:id", auth, async(req, res)=>{
    let userId = req.query.id;
    let postuser = await PostModel.findById(req.params.id);


    if(userId != postuser.user){
        return res.status(404).json({"msg": "logged user and post should be of same user"})
    }
    if(req.body.text && req.body.image){
        try {
            await PostModel.findByIdAndUpdate(req.params.id, {"text": req.body.text, "image": req.body.image})
            res.status(201).json({"msg": "post updated!"})
        } catch (error) {
            console.log(error)
        }
    }else if(req.body.text){
        try {
            await PostModel.findByIdAndUpdate(req.params.id, {"text": req.body.text})
            res.status(201).json({"msg": "post updated!"})
        } catch (error) {
            console.log(error)
        }
    }else if(req.body.image){
        try {
            await PostModel.findByIdAndUpdate(req.params.id, {"image": req.body.image})
            res.status(201).json({"msg": "post updated!"})
        } catch (error) {
            console.log(error)
        }
    }
});

postRouter.delete("/posts/:id",auth, async(req, res)=>{
    let userId = req.query.id;
    try {
        const x = await PostModel.findById( req.params.id)
    if(userId != x.user){
        return res.status(404).json({"msg": "logged user and post should be of same user"})
    }
        await PostModel.findByIdAndDelete(req.params.id);
        res.status(202).json({"msg": "post deleted!"})
    } catch (error) {
        console.log(error)  
    }
});

postRouter.post("/posts/:id/like",auth, async(req, res)=>{
    let userId = req.query.id;
    try {
        await PostModel.updateOne({_id: req.params.id}, {$push: {likes: userId}})
        res.status(201).json({"msg": "liked!"})
    } catch (error) {
        console.log(error)
    }
})

postRouter.post("/posts/:id/comment",auth, async(req, res)=>{
    let userId = req.query.id;
    try {
        await PostModel.updateOne({_id: req.params.id}, {$push: {likes: {user: userId, text: req.body.text, createdAt: Date.now}}})
        res.status(201).json({"msg": "commented!"})
    } catch (error) {
        console.log(error)
    }
})

postRouter.get("/posts/:id", async(req, res)=>{
    try {
        let post = await PostModel.findById(req.params.id)
        res.status(200).json(post)
    } catch (error) {
        console.log(error)
    }
})

module.exports = {
    postRouter
}