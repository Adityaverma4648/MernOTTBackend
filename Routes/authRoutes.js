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
  if (token == null) return res.sendStatus(403);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
  if (err) return res.sendStatus(404);
  req.user = user;
  next();
  });
}

router.post("/register" , async (req , res)=>{  
    const {userName, email, password} = req.body;
    
    if(!userName || !email || !password){
        res.status(400).json("Fill all the entries!");
    }
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json("User Already Exists!");
    }
    const user = await User.create({
        userName,
        email,
        password,
      });
    
      if (user) {
        res.status(201).redirect('login');
        //  redirected on login 
      } else {
        res.status(400).json("User Not Found")
      }

});

router.post("/login",(async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const user = await User.findOne({ email });
  console.log(user);
  if (user && (await user.matchPassword(password))) {
    const token  = generateToken(user);
    res.status(200).send({token});
  } else {
    res.status(400).json('Something broke - User Not Found');
  }
}))




router.put('/logout', verifyToken ,(req, res) => {
  const authHeader = req.headers["authorization"];
  jwt.sign(authHeader, "", { expiresIn: 1 }, (logout, err) => {
    if (logout) {
      res.send({ status : "success" });
    } else {
      res.send({ status : "error" });
    }
  });

})

//  google auth
router.get('/google', passport.authenticate('google', { scope: ['profile','email'] }))

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/log')
  }
)





module.exports = router;