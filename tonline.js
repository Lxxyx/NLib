'use strict';

require('babel-polyfill');

var request = require('request');
var iconv = require('iconv-lite');

var firstPage = 'http://online.ncu.edu.cn/eol/homepage/common/';
var loginPage = 'http://online.ncu.edu.cn/eol/homepage/common/login.jsp';

var request = request.defaults({ jar: true });
var j = request.jar();

request.get({ url: firstPage, jar: j }, function (err, res, body) {
  var cookies = j.getCookieString(firstPage);
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
    request(Options, function (error, resp, html) {
      var mainJspOptions = {
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
          'Referer': 'http://online.ncu.edu.cn/eol/homepage/common/'
        }
      };
      if (resp.statusCode === 302) {
        request(mainJspOptions, function (errors, response, htmlS) {
          var iconvHtml = iconv.decode(htmlS, 'gb2312');
          console.log(iconvHtml);
        });
      }
    });
  }
});
