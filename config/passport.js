const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const pool = require("../db");

require("dotenv").config();

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

//일단 console창에 뜨는 거는 개인정보랑 관련된 부분도 있어서 주석처리(삭제한 건 없으니 필요하면 주석 풀면 됨!)
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "/api/auth/google/callback",
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      if (profile.email.indexOf("@sungshin.ac.kr") == -1) {
        return done("Use only sungshin email!");
      } else {
      process.nextTick(async () => {
        let user = {};
        try {
          const [result] = await pool.query(
            "SELECT * FROM user WHERE iduser=?",
            [profile.id]
          );
          user.id = profile.id;
          user.name = profile.displayName;
          user.email = profile.email;

          if (result.length == 1) {
            //로그인
          } else if (result.length == 0) {
            //새로운유저
            try {
              pool.query(
                "INSERT INTO user (`iduser`, `email`, `name`) VALUES (?,?,?)",
                [user.id, user.email, user.name]
              );
            } catch (err) {
              console.error(err);
            }
          } else {
            return done(false);
          }
          return done(null, user);
        } catch (err) {
          console.error(err);
        }
      });
    }
     }
  )
);

module.exports = passport;
