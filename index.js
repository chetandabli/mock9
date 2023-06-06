const express = require("express");
const app = express();
require('dotenv').config();
const { userRouter } = require("./routes/user");
const { connection } = require("./configs/db")

app.use(express.json());

app.get("/", (req, res)=>{
    res.send("Welcome to Social Media App")
});

app.use("/api", userRouter);

app.listen(process.env.port, async()=>{
    try {
        await connection;
        console.log("connected to db!")
    } catch (error) {
        console.log(error)
    }
    console.log("app is running...")
})