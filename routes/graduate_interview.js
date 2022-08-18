const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const templates = require("../lib/templates");
const path = require("path");

router.post("/post", async (req, res) => {
    const iduser = path.parse(req.params.iduser).base;
    const job=req.body.job;
    const schoolId=req.body.schoolId;
    const content=req.body.content;

    try {
        const data = await pool.query(
          `INSERT INTO graduate_interview (graduateId, job, schoolId, content) VALUES(?, ?, ?, ?)`,
          [iduser, job, schoolId, content]
        );
        //res.write('<script>window.location="/api/graduate_interview_list"</script>');
      } catch (err) {
        console.error(err);
        //res.write('<script>window.location="/api/graduate_interview_list"</script>');
      }
  });

module.exports = router;