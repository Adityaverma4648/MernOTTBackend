const express = require('express');
const router = express.Router();

// importing models

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.status(400).send("Token Is null");
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(404);
    req.user = user;
    next();
    });
  }

  router.get('/getWatchLater',async(req,res)=>{
    const {userName, email, password} = req.body;

    console.log(req.body);
    
    if(!userName || !email || !password){
        res.status(400).json({message : "Fill all the entries!"});
    }
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({message : "UserEmail Already Exists!"});
    }
    const user = await User.create({
        userName,
        email,
        password,
      });
    
      if (user) {
        res.status(200).json({message : "successfully registered!"});
        //  redirected on login 
      } else {
        res.status(400).json({message : "Server Error"});
      }

      res.send("done")
  });