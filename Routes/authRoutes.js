const express = require('express');
const passport = require('passport');
const User = require('../Model/User');
const generateToken = require('../config/JWT');
const jwt = require('jsonwebtoken');
// app instance 
const router = express.Router();

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
router.post("/getUserDetails", verifyToken ,async(req,res)=>{
  console.log(req);
  const {token} = req.body;
  if (token == null) return res.status(400).send("Token Is null");
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
  if (err) return res.sendStatus(404);
  req.user = user;
  res.status(200).json(req.user);
   })
});

router.post("/register" , async (req , res)=>{  
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

});

router.post("/login",(async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const user = await User.findOne({ email });
  console.log(user);
  if (user && (await user.matchPassword(password))) {
    const token  = generateToken(user);
    res.status(200).json({token : token , user : user});
  }else if(user && !(await user.matchPassword(password))){
      res.status(400).json("Incorrect password!")
  } else {
    res.status(400).json('User not found:Please register yourself first or try another email');
  }
}))

router.post('/logout', verifyToken ,(req, res) => {
    const {token} = req.body ;
   jwt.sign(token, process.env.JWT_SECRET, { expiresIn: 1 }, (logout, err) => {
    if (logout) {
      res.status(200).json({status : "OK", message : "Successfully LoggedOut!" });
    } else if(err) {
      res.status(400).json("Something went Wrong")
    }
  });

})







module.exports = router;