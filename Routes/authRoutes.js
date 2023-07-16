const express = require('express');
const passport = require('passport');
const User = require('../Model/User');
const generateToken = require('../config/JWT');

// app instance 
const router = express.Router();


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
    const token  = generateToken(user._id);
    const userData  = await User.find({email});
    console.log(userData , token);
    res.status(200).json({userData , token});
  } else {
    res.status(400).json('Something broke - User Not Found');
  }
}))




router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
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