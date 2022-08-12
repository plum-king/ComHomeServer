const express = require("express");
const router = express.Router();
const passport = require("../config/passport.js");
const pool = require("../db.js");
const templates = require("../lib/templates");

router.post("/edu_contest", async (req, res) => {
  let post = req.body;
  const user = req.user.id;
  const no = post.no;

  try {
    const edu_contest_scrap = await pool.query(
      `UPDATE scrap SET edu_contest_no =? WHERE iduser =?`,
      [no, user]
    );
  } catch (err) {
    console.error(err);
  }
});

router.post("/edu_contest_cancel", async (req, res) => {
  let post = req.body;
  const user = req.user.id;

  try {
    const scrap_cancel = await pool.query(
      `UPDATE scrap SET edu_contest_no = null WHERE iduser =?`,
      [user]
    );
  } catch (err) {
    console.error(err);
  }
});

router.post("/recruit_intern", async (req, res) => {
  let post = req.body;
  const user = req.user.id;
  const no = post.no;

  try {
    const recruit_intern_scrap = await pool.query(
      `UPDATE scrap SET recruit_intern_no =? WHERE iduser =?`,
      [no, user]
    );
  } catch (err) {
    console.error(err);
  }
});

router.post("/recruit_intern_cancel", async (req, res) => {
  let post = req.body;
  const user = req.user.id;

  try {
    const scrap_cancel = await pool.query(
      `UPDATE scrap SET recruit_intern_no = null WHERE iduser =?`,
      [user]
    );
  } catch (err) {
    console.error(err);
  }
});

//아직 안함, html 구조 이해 못함 + ddl문 받으면 추가하기
router.post("/exhibition", async (req, res) => {
  let post = req.body;
  const user = req.user.id;
  const no = post.no;

  try {
    const exhibition_scrap = await pool.query(
      `UPDATE scrap SET exhibition_no =? WHERE iduser =?`,
      [no, user]
    );
  } catch (err) {
    console.error(err);
  }
});

router.post("/exhibition_cancel", async (req, res) => {
  let post = req.body;
  const user = req.user.id;
  const no = post.no;

  try {
    const scrap_cancel = await pool.query(
      `UPDATE scrap SET exhibition_no = null WHERE iduser =?`,
      [user]
    );
  } catch (err) {
    console.error(err);
  }
});
/////////////////////////////////

router.post("/job_review", async (req, res) => {
  let post = req.body;
  const user = req.user.id;
  const no = post.no;

  try {
    const job_review_scrap = await pool.query(
      `UPDATE scrap SET job_review_no =? WHERE iduser =?`,
      [no, user]
    );
  } catch (err) {
    console.error(err);
  }
});

router.post("/job_review_cancel", async (req, res) => {
  let post = req.body;
  const user = req.user.id;
  const no = post.no;

  try {
    const scrap_cancel = await pool.query(
      `UPDATE scrap SET job_review_no = null WHERE iduser =?`,
      [user]
    );
  } catch (err) {
    console.error(err);
  }
});

router.post("/extra_review", async (req, res) => {
  let post = req.body;
  const user = req.user.id;
  const no = post.no;

  try {
    const extra_review_scrap = await pool.query(
      `UPDATE scrap SET extra_review_no =? WHERE iduser =?`,
      [no, user]
    );
  } catch (err) {
    console.error(err);
  }
});

router.post("/extra_review_cancel", async (req, res) => {
  let post = req.body;
  const user = req.user.id;
  const no = post.no;

  try {
    const scrap_cancel = await pool.query(
      `UPDATE scrap SET extra_review_no = null WHERE iduser =?`,
      [user]
    );
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
