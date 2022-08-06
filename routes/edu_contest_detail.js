const express = require("express");
const router = express.Router();
const passport = require("../config/passport.js");
const pool = require("../db.js");
const templates = require("../lib/templates");
const path = require("path");
const multer = require("multer");

router.get("/:edu_contest_no", async (req, res) => {
  const edu_contest_no = path.parse(req.params.edu_contest_no).base;
  const title = edu_contest_no + "번 게시글";
  const head = ``;
  const data = await pool.query(`SELECT * FROM edu_contest where no = ?`, [
    edu_contest_no,
  ]);

  let body = `<p>${data[0][0].title}</p> 
  <p>${data[0][0].content}</p>
  <img src = ${data[0][0].img}> `;
  if (data[0][0].iduser == req.user.id) {
    //내 게시글일 경우
    body += `<form action="/api/edu_contest_edit" method="post">
    <input type="hidden" name="no" value="${data[0][0].no}" />
    <input type="submit" name="edit" value="수정하기" />
  </form>

  <form action="/api/edu_contest_edit/delete" method="post">
    <input type="hidden" name="no" value="${data[0][0].no}" />
    <input type="submit" name="delete" value="삭제하기"
      onClick="return confirm('Are you sure you want to delete this post?')" />
  </form>
  
  <form action="/api/edu_contest_write/expire" method="post">

  <script type="text/javascript">
        function is_con_exp_time() {
          const ch = document.getElementById("con_exp_time");
          const is_checked = ch.checked;
          document.getElementById('con_exp_time').value = is_checked;
        }
    </script>
  <input type="hidden" name="no" value="${data[0][0].no}" />
  <input type='radio' id='con_exp_time' name='con_exp_time' onclick="is_con_exp_time();" value="" /> 현재를 마감으로
  <input type="submit" name="delete" value="마감"
    onClick="return confirm('모집을 마감하시겠습니까?')" />
  </form>
  `;
  }
  body += `<strong>댓글</strong><br>
  `;

  //댓글 조회
  let comment_write = ``;
  const comment = await pool.query(
    `SELECT * FROM edu_contest_comment WHERE edu_contest_no = ?`,
    [edu_contest_no]
  );
  let i = 0;
  if (comment[0][0] == undefined) {
    //댓글 없는 경우
    body += "<p>아직 댓글이 없습니다.</p>";
  } else {
    while (i < comment[0].length) {
      //댓글 있는 경우
      const name = await pool.query(`SELECT name FROM user WHERE iduser = ?`, [
        comment[0][i].iduser,
      ]);
      if (comment[0][i].iduser == req.user.id) {
        //내 댓글이거나
        body += ` <div>
      <div>
      <div>
            댓글 작성자: ${name[0][0].name}
        </div>
      <span class="comment-content">
            댓글: ${comment[0][i].content} 
        </span>
        <form action="/api/edu_contest_comment_edit" method="post">
    <input type="hidden" name="no" value="${comment[0][i].no}" />
    <input type="submit" name="edit" value="수정하기" />
  </form>

  <form action="/api/edu_contest_comment_edit/delete" method="post">
    <input type="hidden" name="no" value="${comment[0][i].no}" />
    <input type="hidden" name="post_no" value="${data[0][0].no}" />
    <input type="submit" name="delete" value="삭제하기"
      onClick="return confirm('Are you sure you want to delete this comment?')" />
  </form>
        
      </div>
    </div>
    `;
      } else if (data[0][0].iduser == req.user.id) {
        //내 게시글일 경우
        body += ` <div>
        <div>
        <div>
              댓글 작성자: ${name[0][0].name}
          </div>
        <span class="comment-content">
              댓글: ${comment[0][i].content}
          </span>
          
        </div>
      </div>
      `;
      } else {
        body += ` <div>
        <div>
        <span> 댓글 작성자:
        ${comment[0][i].secret_check ? "익명" : name[0][0].name}
    </span>
        <span class="comment-content">
              댓글: 
              ${comment[0][i].anon_check ? "비밀댓글" : comment[0][i].content}
          </span>
         
        </div>
      </div>
      `;
      }

      i++;
    }
  }
  if (data[0][0].iduser == req.user.id) {
    comment_write = `자신의 게시글에는 댓글을 작성할 수 없습니다.`;
  } else {
    comment_write += `<form class="comment" action="/api/edu_cont_comment_write" method="POST">
    <script type="text/javascript">
        function is_secret_checked() {
          const ch = document.getElementById("my_secret_checkbox");
          const is_checked = ch.checked;
          document.getElementById('my_secret_checkbox').value = is_checked;
        }

        function is_anon_checked(){
          const ch = document.getElementById("my_anon_checkbox");
          const is_checked = ch.checked;
          document.getElementById('my_anon_checkbox').value = is_checked;
        }
    </script>
        <input type='checkbox' id='my_secret_checkbox' name='my_secret_checkbox' onclick="is_secret_checked();" value="" /> 비밀 
         <input type='checkbox' id='my_anon_checkbox' name='my_anon_checkbox' onclick="is_anon_checked();" value=""  /> 익명
         <input name="edu_contest_comment_cont" placeholder="여기에 댓글을 입력해주세요"></input>
        
        <input name="edu_contest_no" type="hidden" value="${edu_contest_no}">
        <br>
        <button type="submit">댓글 입력</button>
      
      </form>
      `;
  }

  body += ` ${comment_write} <br> <a href = "/api/edu_contest_list">목록으로 돌아가기</a><br>  `;
  var html = templates.HTML(title, head, body);
  res.send(html);
});

module.exports = router;
