const port = 5000;
const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
const cors=require("cors");

app.use(cors());
app.use(session({secret: "MySecret", resave: false, saveUninitialized: true}));

// Passport setting
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use("/uploads", express.static(__dirname + "/uploads"));

//홈페이지 생성 (req.user는 passport의 serialize를 통해 user 정보 저장되어있음)
app.get("/", async (req, res) => {
  const temp = getPage("Welcome", "Welcome to visit...", getBtn(req.user));
  // const data = getHtml(); 크롤링 확인하려고..
  res.send(temp);
});

//프론트 임시로->url 바로 들어가도 된다.
const getBtn = (user) => {
  return user !== undefined
    ? `${user.name} | <a href="/auth/logout">logout</a> <br><br> <a href = "/extra_review_list">대외활동 후기 바로가기</a> <br><br> <a href = "/job_review_list">취업 후기 바로가기</a> <br><br> <a href = "/edu_contest_list">교육/공모전 글 바로가기</a> <br><br> <a href = "/student_council_notice_list">학생회 공지</a>`
    : `<a href="/api/auth/google">Google Login</a>`;
};

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

            <br> <a href="/api/exhibition">작품전시페이지</a>
            <br> <a href="/api/recruit_internship_list">채용인턴십페이지</a>
        </body>
        </html>
        `;
};

//routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/exhibition", require("./routes/exhibition"));
app.use("/api/exhibition_edit", require("./routes/exhibition_edit"));
app.get("/api/extra_review_list", require("./routes/extra_review_list"));
app.get("/api/extra_review_write", require("./routes/extra_review"));
app.post("/api/extra_review_write", require("./routes/extra_review"));
app.get("/api/extra_review_detail/:review_no", require("./routes/extra_review_detail"));

//취업 후기 글
app.get("/api/job_review_list", require("./routes/job_review_list"));
app.get("/api/job_review_write", require("./routes/job_review"));
app.post("/api/job_review_write", require("./routes/job_review"));
app.get("/api/job_review_detail/:review_no", require("./routes/job_review_detail"));

//채용인턴십 글
app.use('/api/recruit_internship', require('./routes/recruit_internship'));
app.use('/api/recruit_internship_list', require('./routes/recruit_internship_list'));
app.use('/api/recruit_internship_detail', require('./routes/recruit_internship_detail'));
app.use('/api/download', require('./routes/download'));

//교육/공모전 글
app.get("/api/edu_contest_list", require("./routes/edu_contest_list"));
app.get("/api/edu_contest_write", require("./routes/edu_contest"));
app.post("/api/edu_contest_write", require("./routes/edu_contest"));
app.get("/api/edu_contest_detail/:edu_contest_no", require("./routes/edu_contest_detail"));

//교육/공모전 댓글
app.post("/api/edu_cont_comment_write", require("./routes/edu_cont_comment"));

//학생회 공지 글 >>/api로 경로 아직 안바꿈..!!!! app.use로 다 바꾸기!!
app.get(
  "/student_council_notice_list",
  require("./routes/student_council_notice_list")
);
app.get(
  "/student_council_notice_check",
  require("./routes/student_council_notice_check")
);
app.post(
  "/student_council_notice_check",
  require("./routes/student_council_notice_check")
);
app.get(
  "/student_council_notice_write",
  require("./routes/student_council_notice")
);
app.post(
  "/student_council_notice_write",
  require("./routes/student_council_notice")
);
app.get(
  "/student_council_notice_detail/:sc_notice_no",
  require("./routes/student_council_notice_detail")
);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
