const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const templates = require("../lib/templates");
const path = require("path");

router.get("/", async (req, res) => {
    let i = 0;
    const data = await pool.query(
      `SELECT * FROM graduate_interview`
    );
    let data_det = data[0];

    // while (i < data_det.length) {
    //   let name = await pool.query( `SELECT name FROM user where iduser=${data_det[i].graduateId}`);
      
    //   body += `<a href = "/api/chat/${data_det[i].no}">${name[0][0].name} 선배님 | ${data_det[i].graduateId}| ${data_det[i].job} | ${data_det[i].schoolId} | ${data_det[i].content}</a><br><hr> `;
    //   i++;
    // }

     //client로 보내기
    //name=name[0];
    res.json({
        data_det: data_det,
        //graduate_name:name
    });
  });

  module.exports = router;