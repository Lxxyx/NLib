'use strict'
const cheerio = require('cheerio');

const isBorrow = function (state) {
  if (!state.data && state.children) {
    if (state.children[0].data === "可借") {
      return 1;
    }
    return 0;
  } else if (state.data === "新书：正在上架") {
    return 1;
  }
  return 0;
}

const getTitle = function (data) {
  let docTitle = /document.title.*/g.exec(data)[0]
  let title = /".*$/g.exec(docTitle)[0]
    .replace('"', '《')
    .replace('"', '》')
    .replace(';', '')
  return title;
}

const getLocation = function (item) {
  if (item.parent) {
    let findState = cheerio.load(item.parent)
    let state = findState('td[width="10%"]').toArray()
    let location = state[0].children[0].data
    if (location) {
      return location;
    }
    return;
  }
  return;
}

const getMailContent = function (data) {
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
  for (let x in data) {
    content += '<p>' +
      '<span>' + '书籍名称：' + data[x].title + '</span>' + '</br>' +
      '<span>' + '书籍位置：' + data[x].location + '</span>' +
      '<span>' + '可借阅数量：' + data[x].canBorrow + '</span>' +
      '</p>' + '</hr>'
  }
  content += "<\/body>";
  content += "<\/html>";
  return content;
}

export {
  isBorrow,
  getTitle,
  getLocation,
  getMailContent
}
