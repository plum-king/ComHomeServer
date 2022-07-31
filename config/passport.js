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
      // 테스트를 위해 잠시 막아둠
      // if (profile.email.indexOf("@sungshin.ac.kr") == -1) {
      //   // console.log('성신이메일아님');
      //   return done("Use only sungshin email!");
      // } else {
      //   // console.log('성신이메일임');
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
          //console.log('profile: ', profile);
          // console.log(profile.id);
          // console.log(profile.displayName);
          // console.log(profile.email);

          if (result.length == 1) {
            //로그인
            //console.log(result);
            //user.name = result[0].name;
            //user.email = result[0].email;
            // console.log("41행");
          } else if (result.length == 0) {
            //새로운유저
            try {
              pool.query(
                "INSERT INTO user (`iduser`, `email`, `name`) VALUES (?,?,?)",
                [user.id, user.email, user.name]
              );
              // console.log("db삽입 성공");
            } catch (err) {
              console.error(err);
            }
          } else {
            //오류발생
            // console.log("51행");
            return done(false);
          }
          //console.log(user);
          return done(null, user); //user data 넘기기
        } catch (err) {
          console.error(err);
        }
      });
    }
    // }
  )
);

module.exports = passport;
