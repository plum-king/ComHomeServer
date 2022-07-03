const express = require('express');
const router   = express.Router();
const passport = require('../config/passport.js');

router.get('/login', function(req,res){
  res.redirect('/auth/google');
});

router.get('/google', passport.authenticate('google', { 
  scope: ['email','profile']
} 
));

router.get('/google/callback',
  passport.authenticate('google'), authSuccess
);

function authSuccess(req, res) {
  res.redirect('/');
}

module.exports = router;