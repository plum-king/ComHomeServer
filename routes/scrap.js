const express = require("express");
const router = express.Router();
const pool = require("../db.js");

router.post("/edu_contest", async (req, res) => {
  let post = req.body;
  const user = req.user.id;
  const no = post.no;
  const type = post.type;
  let status = 404;

  try {
    const edu_contest_scrap = await pool.query(
      `INSERT INTO scrap(iduser,type,no) VALUES (?, ?, ?)`,
      [user, type, no]
    );
  } catch (err) {
    console.error(err);
  }
});

router.post("/edu_contest_cancel", async (req, res) => {
  let post = req.body;
  const user = req.user.id;
  const type = post.type;
  const no = post.no;

  try {
    const scrap_cancel = await pool.query(
      `DELETE FROM scrap WHERE iduser = ?, type =?, no =?`,
      [user, type, no]
    );
  } catch (err) {
    console.error(err);
  }
});

router.post("/recruit_intern", async (req, res) => {
  let post = req.body;
  const user = req.user.id;
  const type = post.type;
  const no = post.no;

  try {
    const recruit_intern_scrap = await pool.query(
      `INSERT INTO scrap(iduser,type,no) VALUES (?, ?, ?)`,
      [user, type, no]
    );
  } catch (err) {
    console.error(err);
  }
});

router.post("/recruit_intern_cancel", async (req, res) => {
  let post = req.body;
  const user = req.user.id;
  const type = post.type;
  const no = post.no;

  try {
    const scrap_cancel = await pool.query(
      `DELETE FROM scrap WHERE iduser = ?, type =?, no =?`,
      [user, type, no]
    );
  } catch (err) {
    console.error(err);
  }
});

//아직 안함, html 구조 이해 못함 + ddl문 받으면 추가하기
router.post("/exhibition", async (req, res) => {
  let post = req.body;
  const user = req.user.id;
  const type = post.type;
  const no = post.no;

  try {
    const exhibition_scrap = await pool.query(
      `INSERT INTO scrap(iduser,type,no) VALUES (?, ?, ?)`,
      [user, type, no]
    );
  } catch (err) {
    console.error(err);
  }
});

router.post("/exhibition_cancel", async (req, res) => {
  let post = req.body;
  const type = post.type;
  const user = req.user.id;
  const no = post.no;

  try {
    const scrap_cancel = await pool.query(
      `DELETE FROM scrap WHERE iduser = ?, type =?, no =?`,
      [user, type, no]
    );
  } catch (err) {
    console.error(err);
  }
});
/////////////////////////////////

router.post("/job_review", async (req, res) => {
  let post = req.body;
  const user = req.user.id;
  const type = post.type;
  const no = post.no;

  try {
    const job_review_scrap = await pool.query(
      `INSERT INTO scrap(iduser,type,no) VALUES (?, ?, ?)`,
      [user, type, no]
    );
  } catch (err) {
    console.error(err);
  }
});

router.post("/job_review_cancel", async (req, res) => {
  let post = req.body;
  const type = post.type;
  const user = req.user.id;
  const no = post.no;

  try {
    const scrap_cancel = await pool.query(
      `DELETE FROM scrap WHERE iduser = ?, type =?, no =?`,
      [user, type, no]
    );
  } catch (err) {
    console.error(err);
  }
});

router.post("/extra_review", async (req, res) => {
  let post = req.body;
  const user = req.user.id;
  const type = post.type;
  const no = post.no;

  try {
    const extra_review_scrap = await pool.query(
      `INSERT INTO scrap(iduser,type,no) VALUES (?, ?, ?)`,
      [user, type, no]
    );
  } catch (err) {
    console.error(err);
  }
});

router.post("/extra_review_cancel", async (req, res) => {
  let post = req.body;
  const type = post.type;
  const user = req.user.id;
  const no = post.no;

  try {
    const scrap_cancel = await pool.query(
      `DELETE FROM scrap WHERE iduser = ?, type =?, no =?`,
      [user, type, no]
    );
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
