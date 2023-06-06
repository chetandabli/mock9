const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next)=>{
  let token = req.headers.authorization?.split(" ")[1] || undefined;
  if(token == undefined){
    res.status(404).json({"msg": "please provide Bearer token"});
    return
  }
  jwt.verify(token, process.env.secretKey, function(err, decoded) {
    if(err) {
      res.status(404).json({"msg": "please login"});
      return
    }else{
      req.query.id = decoded.id;
      next()
    }
});
}

module.exports = {
  auth
}

