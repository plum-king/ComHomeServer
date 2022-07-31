const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const templates = require("../lib/templates");
const path = require("path");

router.get("/:notice_id", async (req, res) => {

    const notice_id = path.parse(req.params.notice_id).base;
    console.log(notice_id);

    //조회수 +1
    try {
        const data = await pool.query("UPDATE recruit_intern set not_views=not_views+1 where notice_id =? ",[notice_id]);
    } catch (err) {
        console.error(err);
    }

    const data = await pool.query(`SELECT * FROM recruit_intern where notice_id = ?`,[notice_id]);
    const file_data = await pool.query(`SELECT * FROM file_intern where notice_id = ?`,[notice_id]);
    //const time_data = await pool.query(`SELECT date_format(not_created_date, '%Y-%m-%d') FROM recruit_intern`);
    //const time_data2 = await pool.query(`SELECT date_format(not_edited_date, '%Y-%m-%d') FROM recruit_intern`);

    res.json({
        data_det:data[0][0],
        file:file_data[0]
    });
});

module.exports = router;