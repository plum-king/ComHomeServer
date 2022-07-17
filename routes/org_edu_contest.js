//크롤링(아직 안됨)
const router = express.Router();
const passport = require("../config/passport.js");
const pool = require("../db.js");
const templates = require("../lib/templates");
const axios = require("axios");
const cheerio = require("cheerio");
const log = console.log;

const getHtml = async () => {
  try {
    return await axios.get("https://www.sungshin.ac.kr/ce/18019/subview.do");
  } catch (error) {
    console.error(error);
  }
};

getHtml()
  .then((html) => {
    let ulList = [];
    const $ = cheerio.load(html.data);
    const $bodyList = $("div").children("tr._artclEven");

    $bodyList.each(function (i, elem) {
      ulList[i] = {
        title: $(this).find("td._artclTdTitle a.artclLinkView strong").text(),
        upload_date: $(this).find("td._artclTdRdate").text(),
        url: $(this).find("td._artclTdTitle a.artclLinkView").attr("href"),
      };
    });

    const data = ulList.filter((n) => n.title);
    return data;
  })
  .then((res) => log(res));
