const express = require('express');
const router   = express.Router();
const passport = require('../config/passport.js');

router.get('/login', async (req, res) => {
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

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});


module.exports = router;