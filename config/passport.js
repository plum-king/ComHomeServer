const passport = require('passport');
const GoogleStrategy  = require('passport-google-oauth2').Strategy;
const db = require('../db');

require('dotenv').config();

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new GoogleStrategy(
  {
    clientID      : process.env.GOOGLE_CLIENT_ID,
    clientSecret  : process.env.GOOGLE_SECRET,
    callbackURL   : '/auth/google/callback',
    passReqToCallback   : true
  }, function(request, accessToken, refreshToken, profile, done){
        if((profile.email).indexOf('@sungshin.ac.kr')==-1){
        console.log('성신이메일아님');
        return done('Use only sungshin email!');
    }
    else{
      console.log('성신이메일임');
      process.nextTick(function(){
        let user = {}
        findUser(profile.id,(response)=>{
            user.id = profile.id;
            user.name=profile.displayName;
            user.email=profile.email;
            console.log('profile: ', profile);
            console.log(profile.id);
            console.log(profile.displayName);
            console.log(profile.email);
            
            if (response == 1){ //오류발생
                return done(false);
            } else if (response == 0) {  //새로운 유저
                console.log('새로운유저다');
                user.newUser = true;
                db.query('INSERT INTO user (`iduser`, `email`, `name`) VALUES (?,?,?)',[user.id,user.email,user.name],(err)=>{
                  if(err){
                    console.log(err);
                  } else{
                     console.log('db삽입성공');
                  }
              });
            } else{   //로그인 성공
                user.newUser = false;
                user.name = response.name;
                user.email = response.email;
            }
            return done(null,user);
        });
    })
    }

  }

));

let findUser = function(id,callback){
  db.query('SELECT * FROM user WHERE iduser=?',[id],(err,result)=>{
      if(err){
          callback(1);
          console.log(err);
          return;
      } else{
          if (result.length == 1){
              callback(result[0])
          } else if (result.length == 0){
              callback(0);
          }
      }
  });
}

module.exports = passport;