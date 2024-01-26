const express = require('express');
const passport = require('passport');

const router = new express.Router();

router.get('/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.send({
      user : req.user
    })
  });

// router.get('/', (req, res) => {
//   res.send('Welcome, ' + req.user.displayName);
// });


module.exports = router;