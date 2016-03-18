'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var cheerio = require('cheerio');

var isBorrow = function isBorrow(state) {
  if (!state.data && state.children) {
    if (state.children[0].data === "可借") {
      return 1;
    }
    return 0;
  } else if (state.data === "新书：正在上架") {
    return 1;
  }
  return 0;
};

var getTitle = function getTitle(data) {
  var docTitle = /document.title.*/g.exec(data)[0];
  var title = /".*$/g.exec(docTitle)[0].replace('"', '《').replace('"', '》').replace(';', '');
  return title;
};

var getLocation = function getLocation(item) {
  if (item.parent) {
    var findState = cheerio.load(item.parent);
    var state = findState('td[width="10%"]').toArray();
    var location = state[0].children[0].data;
    if (location) {
      return location;
    }
    return;
  }
  return;
};

var getMailContent = function getMailContent(data) {
  var content = "";
  content += "<!DOCTYPE html>";
  content += "<html lang=\"zh-cn\">";
  content += "<head>";
  content += "  <meta charset=\"UTF-8\">";
  content += "  <title>Document<\/title>";
  content += "  <style type=\"text\/css\">";
  content += "    span {";
  content += "      display:inline-block;";
  content += "      padding: 10px;";
  content += "    }";
  content += "  <\/style>";
  content += "<\/head>";
  content += "<body>";
  for (var x in data) {
    content += '<p>' + '<span>' + '书籍名称：' + data[x].title + '</span>' + '</br>' + '<span>' + '书籍位置：' + data[x].location + '</span>' + '<span>' + '可借阅数量：' + data[x].canBorrow + '</span>' + '</p>' + '</hr>';
  }
  content += "<\/body>";
  content += "<\/html>";
  return content;
};

exports.isBorrow = isBorrow;
exports.getTitle = getTitle;
exports.getLocation = getLocation;
exports.getMailContent = getMailContent;