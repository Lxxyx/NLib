import 'babel-polyfill'
const rp = require('request-promise');
var request = require('request');
const fsp = require('fs-promise');
const cheerio = require('cheerio');
var iconv = require('iconv-lite');

var firPage = 'http://online.ncu.edu.cn/eol/homepage/common/'
var loginPage = 'http://online.ncu.edu.cn/eol/homepage/common/login.jsp'

var request = request.defaults({ jar: true })
var j = request.jar()

request.get({ url: firPage, jar: j }, (err, res, body) => {
  var cookies = j.getCookieString(firPage);
  if (res.statusCode === 200) {
    var Options = {
      method: 'POST',
      url: 'http://online.ncu.edu.cn/eol/homepage/common/login.jsp',
      encoding: null,
      headers: {
        'Host': 'online.ncu.edu.cn',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-cn',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'http://online.ncu.edu.cn',
        'Content-Length': 56,
        Connection: 'keep-alive',
        'User-Agent': 'Mozilla/5.0(Macintosh;IntelMacOSX10_10_5)AppleWebKit/601.4.4(KHTML,likeGecko)Version/9.0.3Safari/601.4.4',
        Referer: 'http://online.ncu.edu.cn/eol/homepage/common/',
        Cookie: cookies
      },
      form: {
        // 填你的账号
        "IPT_LOGINUSERNAME": '',
        // 填你的密码
        "IPT_LOGINPASSWORD": ''
      }
    };
    request(Options, (error, resp, html) => {
      let mainJspOptions = {
        method: 'GET',
        url: 'http://online.ncu.edu.cn/eol/welcomepage/student/index.jsp',
        encoding: null,
        headers: {
          'Host': 'online.ncu.edu.cn',
          'Origin': 'http://online.ncu.edu.cn',
          'Cookie': cookies,
          'Connection': 'keep-alive',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'User-Agent': 'Mozilla/5.0(Macintosh;IntelMacOSX10_10_5)AppleWebKit/601.4.4(KHTML,likeGecko)Version/9.0.3Safari/601.4.4',
          'Accept-Encoding': 'gzip,deflate',
          'Accept-Language': 'zh-cn',
          'Referer': 'http://online.ncu.edu.cn/eol/homepage/common/',
        }
      }
      if (resp.statusCode === 302) {
        request(mainJspOptions, (errors, response, htmlS) => {
          let iconvHtml = iconv.decode(htmlS, 'gb2312');
          console.log(iconvHtml)
        })
      }
    })
  }
})
