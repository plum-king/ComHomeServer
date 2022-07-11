const express = require('express');
const pool = require('../db');
const router   = express.Router();

router.get('/', async (req, res) => {
    const data = await pool.query("select * from extra_review");
    res.render('extra', {result : data[0]});
  });


router.get('/write', async (req, res) => {
    res.render('extraWrite');
  });
router.post('/write', async (req, res)=>{
    const userid = req.user.id;
    const review_title=req.body.title;
    const review_content=req.body.content;
    const sql = "INSERT INTO extra_review (review_title, review_cont, iduser) VALUES (?,?,?)";
    const params = [review_title, review_content, userid];
    
    const data = await pool.query(sql,params);
    res.render("extraView", {result : req.body});

});


module.exports = router;