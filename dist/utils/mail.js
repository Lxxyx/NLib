'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var email = require("emailjs");
var server = email.server.connect({
  user: "LxxyxNlib@aliyun.com",
  password: "", // You Email Password
  host: "smtp.aliyun.com",
  ssl: true
});

var sendMail = function sendMail(data) {
  var message = {
    text: data,
    from: "LxxyxNlib@aliyun.com",
    to: "841380530@qq.com",
    subject: "订阅书籍可借阅",
    attachment: [{
      data: data,
      alternative: true
    }]
  };
  server.send(message, function (err, message) {
    console.log(err || message);
  });
};

exports.sendMail = sendMail;