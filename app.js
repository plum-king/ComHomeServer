const port = 3000;
const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");

app.use(session({secret: "MySecret", resave: false, saveUninitialized: true}));

// Passport setting
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({extended: false}));
app.use(express.json());

//홈페이지 생성 (req.user는 passport의 serialize를 통해 user 정보 저장되어있음)
app.get("/", async (req, res) => {
  const temp = getPage("Welcome", "Welcome to visit...", getBtn(req.user));
  res.send(temp);
});

//프론트 임시로->url 바로 들어가도 된다.
const getBtn = (user) =>{
    return user !== undefined ? `${user.name} | <a href="/auth/logout">logout</a> <br><br> <a href = "/extra_review_list">대외활동 후기 바로가기</a> <br><br> <a href = "/job_review_list">취업 후기 바로가기</a>`: `<a href="/auth/google">Google Login</a>`;
}

const getPage = (title, description, auth) => {
  return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
        </head>
        <body>
            ${auth}
            <h1>${title}</h1>
            <p>${description}</p>
        </body>
        </html>
        `;
};


//routes
app.use('/auth', require('./routes/auth'));
app.get("/extra_review_list", require("./routes/extra_review_list"));
app.get("/extra_review_write", require("./routes/extra_review"));
app.post("/extra_review_write", require("./routes/extra_review"));
app.get("/extra_review_detail/:review_no", require("./routes/extra_review_detail"));
app.use("/auth", require("./routes/auth"));
app.get("/job_review_list", require("./routes/job_review_list"));
app.get("/job_review_write", require("./routes/job_review"));
app.post("/job_review_write", require("./routes/job_review"));
app.get("/job_review_detail/:review_no", require("./routes/job_review_detail"));

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
